import React, { useRef } from 'react';
import { RTCClient } from '../utils/rtcClient';
import { Video } from './Video';

type VideoRemotePropsType = {
	rtcClient: RTCClient;
};

export const VideoRemote: React.FC<VideoRemotePropsType> = ({ rtcClient }) => {
	const videoRef = useRef<HTMLVideoElement>(null);

	return <Video isMuted={false} name={rtcClient.remotePeerName} videoRef={videoRef} />;
};
