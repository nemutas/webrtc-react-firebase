import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { RTCClient } from '../utils/rtcClient';
import { VideoLocal } from './VideoLocal';
import { VideoRemote } from './VideoRemote';

type VideoAreaPropsType = {
	rtcClient: RTCClient;
};

export const VideoArea: React.FC<VideoAreaPropsType> = ({ rtcClient }) => {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<Grid container spacing={0}>
				<Grid item xs={12} sm={6}>
					<VideoLocal rtcClient={rtcClient} />
				</Grid>
				<Grid item xs={12} sm={6}>
					<VideoRemote rtcClient={rtcClient} />
				</Grid>
			</Grid>
		</div>
	);
};

const useStyles = makeStyles({
	root: {
		flexGrow: 1
	}
});
