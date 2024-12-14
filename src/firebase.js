import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; 

let config = {
  apiKey: "AIzaSyAGNBdL6Efww0YY4apaZDjWFzuTtElsaiU",
  authDomain: "nexus-saude-app.firebaseapp.com",
  projectId: "nexus-saude-app",
  storageBucket: "nexus-saude-app.firebasestorage.app",
  messagingSenderId: "853286387659",
  appId: "1:853286387659:web:ca32f417b66ba8eb6bc04e",
  measurementId: "G-CNM23HDVN0",
};

const firebaseApp = initializeApp(config);

export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);