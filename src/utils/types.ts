// https://developer.mozilla.org/en-US/docs/Web/API/RTCSessionDescription/toJSON
export type RTCSessionDescriptionType = {
	sdp: string | null;
	type: 'offer' | 'answer' | 'pranswer' | null;
};

export type SignallingDataType = {
	sender: string;
	sessionDescription?: RTCSessionDescriptionType;
	type: 'offer' | 'answer' | 'candidate';
};
