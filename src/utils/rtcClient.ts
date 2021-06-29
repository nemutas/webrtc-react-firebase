// RTCPeerConnectionのインスタンス実装例：https://developer.mozilla.org/en-US/docs/Web/API/RTCIceServer/urls
// 公開されているStunServer：http://www.stunprotocol.org/

import { FirebaseSignallingClient } from './firebaseSignallingClient';

export class RTCClient {
	rtcPeerConnection;
	mediaStream: MediaStream | null;
	private _firebaseSignallingClient;
	private _localPeerName;
	private _remotePeerName;

	constructor(
		public remoteVideoRef: React.RefObject<HTMLVideoElement>,
		private _setRtcCliant: (rtcClient: RTCClient) => void
	) {
		const config = {
			iceServers: [{ urls: 'stun:stun.stunprotocol.org' }]
		};
		this.rtcPeerConnection = new RTCPeerConnection(config);
		this._firebaseSignallingClient = new FirebaseSignallingClient();
		this.mediaStream = null;
		this._localPeerName = '';
		this._remotePeerName = '';
	}

	get localPeerName() {
		return this._localPeerName;
	}

	set localPeerName(name: string) {
		this._localPeerName = name;
		this.setRtcClient();
	}

	get remotePeerName() {
		return this._remotePeerName;
	}

	set remotePeerName(name: string) {
		this._remotePeerName = name;
		this.setRtcClient();
	}

	/**
	 * インスタンスの状態を更新する（再renderされる）
	 */
	private setRtcClient() {
		this._setRtcCliant(this);
	}

	private async getUserMedia() {
		try {
			const constraints = { audio: true, video: true };
			this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
		} catch (err) {
			console.error(err);
		}
	}

	async setMediaStream() {
		await this.getUserMedia();
		this.addTracks();
		this.setRtcClient();
	}

	// -----------------------------------------
	// Trackの追加
	// https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addTrack

	private addTracks() {
		this.addAudioTrack();
		this.addVideoTrack();
	}

	private addAudioTrack() {
		if (this.mediaStream) {
			this.rtcPeerConnection.addTrack(this.audioTrack!, this.mediaStream);
		}
	}

	private addVideoTrack() {
		if (this.mediaStream) {
			this.rtcPeerConnection.addTrack(this.videoTrack!, this.mediaStream);
		}
	}

	private get audioTrack() {
		return this.mediaStream?.getAudioTracks()[0];
	}

	private get videoTrack() {
		return this.mediaStream?.getVideoTracks()[0];
	}

	// -----------------------------------------
	/**
	 * remote（相手側）に接続する
	 * @param remotePeerName 相手の名前
	 */
	connect(remotePeerName: string) {
		this._remotePeerName = remotePeerName;
		this.setOnicecandidateCallback();
		this.setOntrack();
		this.setRtcClient();
	}

	/**
	 * 通信経路をremoteへ渡す
	 * https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/onicecandidate
	 */
	private setOnicecandidateCallback() {
		this.rtcPeerConnection.onicecandidate = event => {
			if (event.candidate) {
				console.log({ candidate: event.candidate });
				// TODO: remoteへcandidateを通知する
			}
		};
	}

	/**
	 * remoteのMediaStreamを監視、取得する
	 * https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/ontrack
	 */
	private setOntrack() {
		this.rtcPeerConnection.ontrack = rtcTrackEvent => {
			if (rtcTrackEvent.track.kind !== 'video') return;
			if (!this.remoteVideoRef.current) return;

			const remoteMediaStream = rtcTrackEvent.streams[0];
			this.remoteVideoRef.current.srcObject = remoteMediaStream;
			this.setRtcClient();
		};

		this.setRtcClient();
	}

	// -----------------------------------------
	/**
	 * リスニングサーバー（firebase rtd）への接続
	 * @param localPeerName 自分の名前
	 */
	startListening(localPeerName: string) {
		this._localPeerName = localPeerName;
		this.setRtcClient();

		this._firebaseSignallingClient.database.ref(localPeerName).on('value', snapshot => {
			const data = snapshot.val();
		});
	}
}
