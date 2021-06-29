// RTCPeerConnectionのインスタンス実装例：https://developer.mozilla.org/en-US/docs/Web/API/RTCIceServer/urls
// 公開されているStunServer：http://www.stunprotocol.org/

import { FirebaseSignallingClient } from './firebaseSignallingClient';

export class RTCClient {
	rtcPeerConection;
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
		this.rtcPeerConection = new RTCPeerConnection(config);
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
			this.rtcPeerConection.addTrack(this.audioTrack!, this.mediaStream);
		}
	}

	private addVideoTrack() {
		if (this.mediaStream) {
			this.rtcPeerConection.addTrack(this.videoTrack!, this.mediaStream);
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
