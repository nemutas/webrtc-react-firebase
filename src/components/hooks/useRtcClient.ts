import { useEffect, useReducer, useState } from 'react';
import { RTCClient } from '../../utils/rtcClient';

export const useRtcClient = () => {
	const [rtcClient, _setRtcClient] = useState<RTCClient>();
	const [, forceRender] = useReducer(val => !val, false);

	const setRtcClient = (rtcClient: RTCClient) => {
		_setRtcClient(rtcClient);
		forceRender();
	};

	useEffect(() => {
		const client = new RTCClient(setRtcClient);
		client.setRtcClient();
	}, []);

	return rtcClient;
};
