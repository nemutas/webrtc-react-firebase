import React from 'react';
import { IconButton, makeStyles } from '@material-ui/core';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import { RTCClient } from '../utils/rtcClient';

type VolumeButtonPropsType = {
	muted: boolean;
	rtcClient: RTCClient;
	setMuted: React.Dispatch<React.SetStateAction<boolean>>;
	isLocal: boolean;
	refVolumeButton: React.MutableRefObject<null>;
};

export const VolumeButton: React.FC<VolumeButtonPropsType> = props => {
	const { muted, rtcClient, setMuted, isLocal, refVolumeButton } = props;
	const classes = useStyles();
	const Icon = muted ? VolumeOffIcon : VolumeUpIcon;

	const onClickHandler = () => {
		setMuted(prev => !prev);
		if (isLocal) rtcClient.toggleAudio();
	};

	return (
		<IconButton ref={refVolumeButton} aria-label="switch mute" onClick={onClickHandler}>
			<Icon className={classes.icon} />
		</IconButton>
	);
};

const useStyles = makeStyles({
	icon: {
		height: 38,
		width: 38
	}
});
