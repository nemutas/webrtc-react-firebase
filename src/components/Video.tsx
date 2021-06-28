import React from 'react';

type VideoPropsType = {
	isMuted: boolean;
	name: string;
	videoRef: React.RefObject<HTMLVideoElement>;
};

export const Video: React.FC<VideoPropsType> = props => {
	const { isMuted, name, videoRef } = props;

	return (
		<>
			<video autoPlay muted={isMuted} ref={videoRef} />
			<div>{name}</div>
		</>
	);
};
