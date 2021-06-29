import 'firebase/database';
import firebase from 'firebase/app';
import { RTCSessionDescriptionType } from './types';

export class FirebaseSignallingClient {
	database;
	localPeerName;
	remotePeerName;

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
		this.remotePeerName = '';
	}

	setPeerNames(localPeerName: string, remotePeerName: string) {
		this.localPeerName = localPeerName;
		this.remotePeerName = remotePeerName;
	}

	get targetRef() {
		return this.database.ref(this.remotePeerName);
	}

	// https://firebase.google.com/docs/database/admin/save-data?hl=ja#node.js_1
	async sendOffer(sessionDescription: RTCSessionDescriptionType) {
		await this.targetRef.set({
			type: 'offer',
			sender: this.localPeerName,
			sessionDescription
		});
	}

	async sendAnswer(sessionDescription: RTCSessionDescriptionType) {
		await this.targetRef.set({
			type: 'answer',
			sender: this.localPeerName,
			sessionDescription
		});
	}

	// https://firebase.google.com/docs/database/web/read-and-write#delete_data
	async remove(path: string) {
		await this.database.ref(path).remove();
	}
}
