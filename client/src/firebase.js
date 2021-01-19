// import * as firebase from 'firebase';
// import core firebase client (required)
import firebase from '@firebase/app';

// import Firebase Authentication (optional)
import '@firebase/auth';

// import Firebase Realtime Database (optional)
import '@firebase/database';

// import Cloud Firestore (optional)
import '@firebase/firestore';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_XssMVPT9DnAmkXJvKbjoLA4bNgeMpnc",
  authDomain: "atlantis-ecom.firebaseapp.com",
  databaseURL: "https://atlantis-ecom.firebaseio.com",
  projectId: "atlantis-ecom",
  storageBucket: "atlantis-ecom.appspot.com",
  messagingSenderId: "1010156667580",
  appId: "1:1010156667580:web:2af3a420fa6f0c0a46c6b9"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();

export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();