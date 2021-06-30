import 'firebase/database';
import firebase from 'firebase/app';
import { RTCSessionDescriptionType } from './types';

export class FirebaseSignallingClient {
	database;
	localPeerName;
	remotePeerName;

	constructor() {
		const firebaseConfig = {
			apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
			authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
			databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
			projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
			storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
			messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
			appId: process.env.REACT_APP_FIREBASE_APP_ID
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

	async sendCandidate(candidate: RTCIceCandidateInit) {
		await this.targetRef.set({
			type: 'candidate',
			sender: this.localPeerName,
			candidate
		});
	}

	// https://firebase.google.com/docs/database/web/read-and-write#delete_data
	async remove(path: string) {
		await this.database.ref(path).remove();
	}
}
