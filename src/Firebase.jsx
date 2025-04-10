// Import the functions you need from the SDKs you need

import { getAuth } from 'firebase/auth';
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCOABpUFx7TcVvmG-9K2I9CnLkQKfJm1E",
  authDomain: "sample-firebase-ai-app-ae6fb.firebaseapp.com",
  projectId: "sample-firebase-ai-app-ae6fb",
  storageBucket: "sample-firebase-ai-app-ae6fb.firebasestorage.app",
  messagingSenderId: "349391593966",
  appId: "1:349391593966:web:54a51c264869a6c292aeff"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);