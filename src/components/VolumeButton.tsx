import React from 'react';
import { IconButton } from '@material-ui/core';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';

type VolumeButtonPropsType = {
	muted: boolean;
	setMuted: React.Dispatch<React.SetStateAction<boolean>>;
};

export const VolumeButton: React.FC<VolumeButtonPropsType> = props => {
	const { muted, setMuted } = props;
	const Icon = muted ? VolumeOffIcon : VolumeUpIcon;

	return (
		<IconButton aria-label="switch mute" onClick={() => setMuted(prev => !prev)}>
			<Icon />
		</IconButton>
	);
};
