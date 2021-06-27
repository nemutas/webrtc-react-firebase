import React from 'react';
import { Button } from '@material-ui/core';

const getMedia = async () => {
	const constraints = { audio: true, video: true };

	try {
		return await navigator.mediaDevices.getUserMedia(constraints);
		/* ストリームを使用 */
	} catch (err) {
		/* エラーを処理 */
		console.error(err);
	}
};

getMedia();

export const App: React.FC = () => {
	return (
		<Button color="primary" variant="outlined">
			Hello, World
		</Button>
	);
};
