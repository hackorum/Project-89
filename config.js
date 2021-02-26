import * as firebase from "firebase";
require("@firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyB_mK1P5cVSSvMoVsvvtEd5FKqQShMXrHM",
  authDomain: "barter-app-c9b58.firebaseapp.com",
  projectId: "barter-app-c9b58",
  storageBucket: "barter-app-c9b58.appspot.com",
  messagingSenderId: "567065373144",
  appId: "1:567065373144:web:d28db140e654be6605eaad",
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
