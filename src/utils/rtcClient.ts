// RTCPeerConnectionのインスタンス実装例：https://developer.mozilla.org/en-US/docs/Web/API/RTCIceServer/urls
// 公開されているStunServer：http://www.stunprotocol.org/

import { FirebaseSignallingClient } from './firebaseSignallingClient';
import { RTCSessionDescriptionType, SignallingDataType } from './types';

export class RTCClient {
	private _rtcPeerConnection;
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
		this._rtcPeerConnection = new RTCPeerConnection(config);
		this._firebaseSignallingClient = new FirebaseSignallingClient();
		this.mediaStream = null;
		this._localPeerName = '';
		this._remotePeerName = '';
	}

	get localPeerName() {
		return this._localPeerName;
	}

	get remotePeerName() {
		return this._remotePeerName;
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

	// =================================================
	// Trackの追加
	// https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addTrack

	private addTracks() {
		this.addAudioTrack();
		this.addVideoTrack();
	}

	private addAudioTrack() {
		if (this.mediaStream) {
			this._rtcPeerConnection.addTrack(this.audioTrack!, this.mediaStream);
		}
	}

	private addVideoTrack() {
		if (this.mediaStream) {
			this._rtcPeerConnection.addTrack(this.videoTrack!, this.mediaStream);
		}
	}

	private get audioTrack() {
		return this.mediaStream?.getAudioTracks()[0];
	}

	private get videoTrack() {
		return this.mediaStream?.getVideoTracks()[0];
	}

	// =================================================
	/**
	 * remote（相手側）に接続する
	 * @param remotePeerName 相手の名前
	 */
	async connect(remotePeerName: string) {
		this._remotePeerName = remotePeerName;
		this.setOnicecandidateCallback();
		this.setOntrack();
		await this.offer();
		this.setRtcClient();
	}

	// https://developer.mozilla.org/en-US/docs/Web/API/RTCSessionDescription/toJSON
	get localDescription() {
		return this._rtcPeerConnection.localDescription?.toJSON() as RTCSessionDescriptionType;
	}

	/**
	 * 通信経路をremoteへ渡す
	 * https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/onicecandidate
	 */
	private setOnicecandidateCallback() {
		this._rtcPeerConnection.onicecandidate = event => {
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
		this._rtcPeerConnection.ontrack = rtcTrackEvent => {
			if (rtcTrackEvent.track.kind !== 'video') return;
			if (!this.remoteVideoRef.current) return;

			const remoteMediaStream = rtcTrackEvent.streams[0];
			this.remoteVideoRef.current.srcObject = remoteMediaStream;
			this.setRtcClient();
		};

		this.setRtcClient();
	}

	/**
	 * シグナリングサーバー（firebase RTDB）経由で、remoteにofferを送信する
	 * https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createOffer
	 */
	private async offer() {
		const sessionDescription = await this.createOffer();
		await this.setLocalDescription(sessionDescription);
		await this.sendOffer();
	}

	private async createOffer() {
		try {
			return await this._rtcPeerConnection.createOffer();
		} catch (e) {
			console.error(e);
		}
	}

	private async setLocalDescription(sessionDescription: RTCSessionDescriptionInit | undefined) {
		try {
			await this._rtcPeerConnection.setLocalDescription(sessionDescription);
		} catch (e) {
			console.error(e);
		}
	}

	private async sendOffer() {
		this._firebaseSignallingClient.setPeerNames(this._localPeerName, this._remotePeerName);
		await this._firebaseSignallingClient.sendOffer(this.localDescription);
	}

	// -------------------------------------------------

	// https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createAnswer
	private async answer(sender: string, sessionDescription: RTCSessionDescriptionType) {
		try {
			this._remotePeerName = sender;
			this.setOnicecandidateCallback();
			this.setOntrack();
			await this.setRemoteDecription(sessionDescription);
			const answer = await this._rtcPeerConnection.createAnswer();
			await this._rtcPeerConnection.setLocalDescription(answer);
			await this.sendAnswer();
		} catch (e) {
			console.error(e);
		}
	}

	private async setRemoteDecription(sessionDescription: RTCSessionDescriptionType) {
		await this._rtcPeerConnection.setRemoteDescription(
			sessionDescription as RTCSessionDescriptionInit
		);
	}

	private async sendAnswer() {
		this._firebaseSignallingClient.setPeerNames(this._localPeerName, this._remotePeerName);
		await this._firebaseSignallingClient.sendAnswer(this.localDescription);
	}

	// =================================================
	/**
	 * リスニングサーバー（firebase RTDB）への接続
	 * @param localPeerName 自分の名前
	 */
	startListening(localPeerName: string) {
		this._localPeerName = localPeerName;
		this.setRtcClient();

		this._firebaseSignallingClient.database.ref(localPeerName).on('value', async snapshot => {
			const data = snapshot.val() as SignallingDataType | null;
			if (!data) return;

			switch (data.type) {
				case 'offer':
					// offerを受け取ったらanswerを返す
					await this.answer(data.sender, data.sessionDescription!);
					break;
				default:
					break;
			}
		});
	}
}
