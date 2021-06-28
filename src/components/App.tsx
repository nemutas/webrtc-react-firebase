import React from 'react';
import { useRtcClient } from './hooks/useRtcClient';
import { InputNameForm } from './InputNameForm';
import { VideoArea } from './VideoArea';

export const App: React.FC = () => {
	const rtcClient = useRtcClient();

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
