// RTCPeerConnectionのインスタンス実装例：https://developer.mozilla.org/en-US/docs/Web/API/RTCIceServer/urls
// 公開されているStunServer：http://www.stunprotocol.org/

import { FirebaseSignallingClient } from './firebaseSignallingClient';
import { RTCSessionDescriptionType, SignallingDataType } from './types';

const INITIAL_AUDIO_ENABLED = false;

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

	get initialAudioMuted() {
		return !INITIAL_AUDIO_ENABLED;
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
		if (!this.mediaStream) return;

		this.audioTrack.enabled = INITIAL_AUDIO_ENABLED;
		this._rtcPeerConnection.addTrack(this.audioTrack, this.mediaStream);
	}

	private addVideoTrack() {
		if (!this.mediaStream) return;

		this._rtcPeerConnection.addTrack(this.videoTrack, this.mediaStream);
	}

	private get audioTrack() {
		return this.mediaStream!.getAudioTracks()[0];
	}

	private get videoTrack() {
		return this.mediaStream!.getVideoTracks()[0];
	}

	toggleAudio() {
		if (!this.mediaStream) return;

		this.audioTrack.enabled = !this.audioTrack.enabled;
		this.setRtcClient();
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
	 * シグナリングサーバー（firebase RTDB）から動的に取得されたremoteの通信経路（candidate）を追加する
	 * https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addIceCandidate
	 * @param candidate
	 */
	private async addIceCandidate(candidate: RTCIceCandidateInit) {
		try {
			const iceCandidate = new RTCIceCandidate(candidate);
			await this._rtcPeerConnection.addIceCandidate(iceCandidate);
		} catch (e) {
			console.error(e);
		}
	}

	/**
	 * 通信経路をシグナリングサーバー（firebase RTDB）を介して、remoteへ渡す
	 * https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/onicecandidate
	 */
	private setOnicecandidateCallback() {
		this._rtcPeerConnection.onicecandidate = async ({ candidate }) => {
			if (candidate) {
				await this._firebaseSignallingClient.sendCandidate(candidate.toJSON());
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

	private async saveReceivedSessionDescription(sessionDescription: RTCSessionDescriptionType) {
		try {
			await this.setRemoteDecription(sessionDescription);
		} catch (e) {
			console.error(e);
		}
	}

	// =================================================
	/**
	 * シグナリングサーバー（firebase RTDB）への接続
	 * @param localPeerName 自分の名前
	 */
	async startListening(localPeerName: string) {
		this._localPeerName = localPeerName;
		this.setRtcClient();

		await this._firebaseSignallingClient.remove(localPeerName);

		this._firebaseSignallingClient.database.ref(localPeerName).on('value', async snapshot => {
			const data = snapshot.val() as SignallingDataType | null;
			if (!data) return;

			switch (data.type) {
				case 'offer':
					// offerを受け取ったらanswerを返す
					await this.answer(data.sender, data.sessionDescription!);
					break;
				case 'answer':
					// 受け取ったanswerを保存する
					await this.saveReceivedSessionDescription(data.sessionDescription!);
					break;
				case 'candidate':
					// 受け取った通信経路（candidate）を追加する
					await this.addIceCandidate(data.candidate!);
					break;
				default:
					this.setRtcClient();
					break;
			}
		});
	}
}
