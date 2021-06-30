import React from 'react';
import { RTCClient } from '../utils/rtcClient';
import { Video } from './Video';

type VideoRemotePropsType = {
	rtcClient: RTCClient;
};

export const VideoRemote: React.FC<VideoRemotePropsType> = ({ rtcClient }) => {
	const videoRef = rtcClient.remoteVideoRef;

	return (
		<Video
			isLocal={false}
			name={rtcClient.remotePeerName}
			rtcClient={rtcClient}
			videoRef={videoRef}
		/>
	);
};
