import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

let firebaseConfig = {
  apiKey: "AIzaSyBO-6_IyCFpO9Tl1MuLCgK_AjPVlC0jTb8",
  authDomain: "chat-away-server.firebaseapp.com",
  projectId: "chat-away-server",
  storageBucket: "chat-away-server.appspot.com",
  messagingSenderId: "515686941803",
  appId: "1:515686941803:web:d7478879a431836cd25d2e",
  measurementId: "G-C5TLJM6F23"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase;