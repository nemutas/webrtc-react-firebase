import React, { useState } from 'react';
import {
	Box, Button, Container, CssBaseline, Link, makeStyles, TextField, Typography
} from '@material-ui/core';
import { RTCClient } from '../utils/rtcClient';

type InputNameFormPropsType = {
	isLocal: boolean;
	rtcClient: RTCClient;
};

export const InputNameForm: React.FC<InputNameFormPropsType> = props => {
	const { isLocal, rtcClient } = props;
	const classes = useStyles();
	const [name, setName] = useState('');
	const label = isLocal ? 'あなたの名前' : '相手の名前';

	const onClickSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		if (isLocal) {
			rtcClient.startListening(name.trim());
		} else {
			rtcClient.connect(name.trim());
		}
		setName('');
	};

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<div className={classes.paper}>
				<Typography component="h1" variant="h5">
					{label}を入力してください
				</Typography>
				<form className={classes.form} noValidate>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						label={label}
						name="name"
						autoFocus
						value={name}
						onChange={e => setName(e.target.value)}
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
						disabled={!name}
						onClick={onClickSubmit}>
						決定
					</Button>
				</form>
			</div>
			<Box mt={8}>
				<Copyright />
			</Box>
		</Container>
	);
};

const Copyright: React.FC = () => {
	return (
		<Typography variant="body2" color="textSecondary" align="center">
			{'Copyright © '}
			<Link color="inherit" href="https://github.com/nemutas">
				nemutas
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
};

const useStyles = makeStyles(theme => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1)
	},
	submit: {
		margin: theme.spacing(3, 0, 2)
	}
}));
