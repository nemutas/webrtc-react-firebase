import React, { useState } from 'react';
import { InputNameForm } from './InputNameForm';

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
	const [localPeerName, setLocalPeerName] = useState('');
	const [remotePeerName, setRemotePeerName] = useState('');

	return (
		<>
			{!localPeerName ? (
				<InputNameForm label="あなたの名前" setPeerName={setLocalPeerName} />
			) : !remotePeerName ? (
				<InputNameForm label="相手の名前" setPeerName={setRemotePeerName} />
			) : (
				<div>Hello!</div>
			)}
		</>
	);
};
