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
		if (!currentVideoRef) return;

		const getMedia = () => {
			try {
				currentVideoRef.srcObject = mediaStream;
			} catch (err) {
				console.error(err);
			}
		};
		getMedia();
	}, [mediaStream, videoRef]);

	return <Video isMuted={true} name={rtcClient.localPeerName} videoRef={videoRef} />;
};
