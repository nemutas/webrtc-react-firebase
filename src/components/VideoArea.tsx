import React from 'react';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
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
			<Grid container spacing={3}>
				<Grid item xs={12} sm={6}>
					<VideoLocal localPeerName={rtcClient.localPeerName} />
				</Grid>
				<Grid item xs={12} sm={6}>
					<VideoRemote remotePeerName={rtcClient.remotePeerName} />
				</Grid>
			</Grid>
		</div>
	);
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			flexGrow: 1
		}
	})
);
