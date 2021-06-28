// RTCPeerConnectionのインスタンス実装例：https://developer.mozilla.org/en-US/docs/Web/API/RTCIceServer/urls
// 公開されているStunServer：http://www.stunprotocol.org/
export class RTCClient {
	rtcPeerConection;
	mediaStream: MediaStream | null;
	private _localPeerName;
	private _remotePeerName;

	constructor(private _setRtcCliant: (rtcClient: RTCClient) => void) {
		const config = {
			iceServers: [{ urls: 'stun:stun.stunprotocol.org' }]
		};
		this.rtcPeerConection = new RTCPeerConnection(config);

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

	setRtcClient() {
		this._setRtcCliant(this);
	}

	async getUserMedia() {
		try {
			const constraints = { audio: true, video: true };
			this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
		} catch (err) {
			console.error(err);
		}
	}
}