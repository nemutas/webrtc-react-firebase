import React from 'react';
import { IconButton } from '@material-ui/core';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import { RTCClient } from '../utils/rtcClient';

type VolumeButtonPropsType = {
	muted: boolean;
	rtcClient: RTCClient;
	setMuted: React.Dispatch<React.SetStateAction<boolean>>;
	isLocal: boolean;
};

export const VolumeButton: React.FC<VolumeButtonPropsType> = props => {
	const { muted, rtcClient, setMuted, isLocal } = props;
	const Icon = muted ? VolumeOffIcon : VolumeUpIcon;

	const onClickHandler = () => {
		setMuted(prev => !prev);
		if (isLocal) rtcClient.toggleAudio();
	};

	return (
		<IconButton aria-label="switch mute" onClick={onClickHandler}>
			<Icon />
		</IconButton>
	);
};
