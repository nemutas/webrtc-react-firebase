import React, { useState } from 'react';
import {
	Box, Button, Container, CssBaseline, Link, makeStyles, TextField, Typography
} from '@material-ui/core';

type InputNameFormPropsType = {
	label: string;
	setPeerName: React.Dispatch<React.SetStateAction<string>>;
};

export const InputNameForm: React.FC<InputNameFormPropsType> = props => {
	const { label, setPeerName } = props;
	const classes = useStyles();
	const [name, setName] = useState('');

	const onClickSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		setPeerName(name.trim());
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
