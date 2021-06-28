import React, { useEffect } from 'react';
import { useRtcClient } from './hooks/useRtcClient';
import { InputNameForm } from './InputNameForm';
import { VideoArea } from './VideoArea';

export const App: React.FC = () => {
	const rtcClient = useRtcClient();

	// 開発時のみ
	// useEffect(() => {
	// 	if (rtcClient) {
	// 		rtcClient.localPeerName = 'User1 Local';
	// 		rtcClient.remotePeerName = 'User2 Local';
	// 	}
	// }, [rtcClient]);

	return (
		<>
			{rtcClient &&
				(!rtcClient.localPeerName ? (
					<InputNameForm isLocal={true} rtcClient={rtcClient} />
				) : !rtcClient.remotePeerName ? (
					<InputNameForm isLocal={false} rtcClient={rtcClient} />
				) : (
					<VideoArea rtcClient={rtcClient} />
				))}
		</>
	);
};
