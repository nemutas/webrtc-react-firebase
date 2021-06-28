import 'firebase/database';
import firebase from 'firebase/app';

export class FirebaseSignallingClient {
	database;
	localPeerName;
	RemotePeerName;

	constructor() {
		const firebaseConfig = {
			apiKey: 'AIzaSyDXpYcGh8kHGd8VlGXqNKmXhUK4kgHw9Q4',
			authDomain: 'nemutas-webrtc-react.firebaseapp.com',
			databaseURL: 'https://nemutas-webrtc-react-default-rtdb.firebaseio.com',
			projectId: 'nemutas-webrtc-react',
			storageBucket: 'nemutas-webrtc-react.appspot.com',
			messagingSenderId: '829520207002',
			appId: '1:829520207002:web:27f173ce08e428fed61323'
		};
		if (firebase.apps.length === 0) firebase.initializeApp(firebaseConfig);
		this.database = firebase.database();
		this.localPeerName = '';
		this.RemotePeerName = '';
	}
}
