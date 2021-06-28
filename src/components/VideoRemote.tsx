import React, { useRef } from 'react';
import { Video } from './Video';

type VideoRemotePropsType = {
	remotePeerName: string;
};

export const VideoRemote: React.FC<VideoRemotePropsType> = ({ remotePeerName }) => {
	const videoRef = useRef<HTMLVideoElement>(null);

	return <Video isMuted={false} name={remotePeerName} videoRef={videoRef} />;
};
