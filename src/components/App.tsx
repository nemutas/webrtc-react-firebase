import React, { useEffect, useState } from 'react';
import { InputNameForm } from './InputNameForm';
import { VideoArea } from './VideoArea';

export const App: React.FC = () => {
	const [localPeerName, setLocalPeerName] = useState('');
	const [remotePeerName, setRemotePeerName] = useState('');

	// 開発時のみ
	useEffect(() => {
		setLocalPeerName('User1 Local');
		setRemotePeerName('User2 Remote');
	}, []);

	return (
		<>
			{!localPeerName ? (
				<InputNameForm label="あなたの名前" setPeerName={setLocalPeerName} />
			) : !remotePeerName ? (
				<InputNameForm label="相手の名前" setPeerName={setRemotePeerName} />
			) : (
				<VideoArea localPeerName={localPeerName} remotePeerName={remotePeerName} />
			)}
		</>
	);
};
