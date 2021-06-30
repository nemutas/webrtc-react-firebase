import React, { useRef } from 'react';
import {
	Card, CardActionArea, CardActions, CardContent, makeStyles, Typography
} from '@material-ui/core';
import { useDimensions } from './hooks/useDimensions';

type VideoPropsType = {
	isMuted: boolean;
	name: string;
	videoRef: React.RefObject<HTMLVideoElement>;
};

export const Video: React.FC<VideoPropsType> = props => {
	const { isMuted, name, videoRef } = props;
	const classes = useStyles();
	const refCard = useRef(null);
	const dimensionsCard = useDimensions(refCard);

	return (
		<Card ref={refCard}>
			<CardActionArea>
				<video autoPlay muted={isMuted} ref={videoRef} width={dimensionsCard.width} />
				<CardContent>
					<Typography gutterBottom variant="h5" component="h2">
						{name}
					</Typography>
				</CardContent>
			</CardActionArea>
			<CardActions></CardActions>
		</Card>
	);
};

const useStyles = makeStyles({
	root: {
		maxWidth: 345
	}
});
