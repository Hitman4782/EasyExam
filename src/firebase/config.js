import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyDXnKhzIq0xR_eT24AxH3aTq9Wm12MZ-rY",
  authDomain: "e-exam-77e25.firebaseapp.com",
  projectId: "e-exam-77e25",
  storageBucket: "e-exam-77e25.appspot.com",
  messagingSenderId: "225719507575",
  appId: "1:225719507575:web:f71b638b7cfc27660e8472",
  measurementId: "G-6BZQK792RH"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };