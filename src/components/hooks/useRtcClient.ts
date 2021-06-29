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
		const createInstance = async () => {
			const client = new RTCClient(setRtcClient);
			await client.setMediaStream();
		};
		createInstance();
	}, []);

	return rtcClient;
};
