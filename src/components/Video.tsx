import React, { useRef, useState } from 'react';
import {
	Card, CardActionArea, CardActions, CardContent, makeStyles, Typography
} from '@material-ui/core';
import { RTCClient } from '../utils/rtcClient';
import { useDimensions } from './hooks/useDimensions';
import { VolumeButton } from './VolumeButton';

type VideoPropsType = {
	isLocal: boolean;
	name: string;
	rtcClient: RTCClient;
	videoRef: React.RefObject<HTMLVideoElement>;
};

export const Video: React.FC<VideoPropsType> = props => {
	const { isLocal, name, rtcClient, videoRef } = props;
	const classes = useStyles();
	const [muted, setMuted] = useState(rtcClient.initialAudioMuted);
	const refCard = useRef(null);
	const dimensionsCard = useDimensions(refCard);

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
				<VolumeButton muted={muted} rtcClient={rtcClient} setMuted={setMuted} isLocal={isLocal} />
			</CardActions>
		</Card>
	);
};

const useStyles = makeStyles({
	root: {
		maxWidth: 345
	}
});
