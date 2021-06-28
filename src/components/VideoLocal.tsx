import React, { useEffect, useRef } from 'react';
import { Video } from './Video';

type VideoLocalPropsType = {
	localPeerName: string;
};

export const VideoLocal: React.FC<VideoLocalPropsType> = ({ localPeerName }) => {
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		const currentVideoRef = videoRef.current;
		if (!currentVideoRef) return;

		const getMedia = async () => {
			const constraints = { audio: true, video: true };
			try {
				const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
				currentVideoRef.srcObject = mediaStream;
			} catch (err) {
				console.error(err);
			}
		};
		getMedia();
	}, [videoRef]);

	return <Video isMuted={true} name={localPeerName} videoRef={videoRef} />;
};
