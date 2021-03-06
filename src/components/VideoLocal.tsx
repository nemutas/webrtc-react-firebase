import React, { useEffect, useRef } from 'react';
import { RTCClient } from '../utils/rtcClient';
import { Video } from './Video';

type VideoLocalPropsType = {
	rtcClient: RTCClient;
};

export const VideoLocal: React.FC<VideoLocalPropsType> = ({ rtcClient }) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const mediaStream = rtcClient.mediaStream;

	useEffect(() => {
		const currentVideoRef = videoRef.current;
		if (currentVideoRef) {
			currentVideoRef.srcObject = mediaStream;
		}
	}, [mediaStream, videoRef]);

	return (
		<Video
			isLocal={true}
			name={rtcClient.localPeerName}
			rtcClient={rtcClient}
			videoRef={videoRef}
		/>
	);
};
