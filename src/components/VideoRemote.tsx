import React from 'react';
import { RTCClient } from '../utils/rtcClient';
import { Video } from './Video';

type VideoRemotePropsType = {
	rtcClient: RTCClient;
};

export const VideoRemote: React.FC<VideoRemotePropsType> = ({ rtcClient }) => {
	// TODO: videoRef は、rtcClientに持たせる
	const videoRef = rtcClient.remoteVideoRef;

	return <Video isMuted={false} name={rtcClient.remotePeerName} videoRef={videoRef} />;
};
