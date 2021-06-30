import React, { useRef, useState } from 'react';
import { Card, CardActionArea, CardActions, CardContent, Typography } from '@material-ui/core';
import { RTCClient } from '../utils/rtcClient';
import { useDimensions } from './hooks/useDimensions';
import AudioAnalyser from './libs/AudioAnalyser';
import { VolumeButton } from './VolumeButton';

type VideoPropsType = {
	isLocal: boolean;
	name: string;
	rtcClient: RTCClient;
	videoRef: React.RefObject<HTMLVideoElement>;
};

export const Video: React.FC<VideoPropsType> = props => {
	const { isLocal, name, rtcClient, videoRef } = props;
	const [muted, setMuted] = useState(rtcClient.initialAudioMuted);
	const refCard = useRef(null);
	const dimensionsCard = useDimensions(refCard);
	const refVolumeButton = useRef(null);
	const dimensionsVolumeButton = useDimensions(refVolumeButton);

	return (
		<Card ref={refCard}>
			<CardActionArea>
				<video autoPlay muted={isLocal || muted} ref={videoRef} width={dimensionsCard.width} />
				<CardContent>
					<Typography gutterBottom variant="h5" component="h2">
						{name}
					</Typography>
				</CardContent>
			</CardActionArea>
			<CardActions>
				<VolumeButton
					muted={muted}
					rtcClient={rtcClient}
					setMuted={setMuted}
					isLocal={isLocal}
					refVolumeButton={refVolumeButton}
				/>
				{!muted && videoRef.current && videoRef.current.srcObject && (
					<AudioAnalyser
						audio={videoRef.current.srcObject}
						width={dimensionsCard.width - dimensionsVolumeButton.width - 40}
					/>
				)}
			</CardActions>
		</Card>
	);
};
