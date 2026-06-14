// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8kOUKLKWW84J1JL0mVW9auF9QP_N7jW8",
  authDomain: "sahayata-portal.firebaseapp.com",
  projectId: "sahayata-portal",
  storageBucket: "sahayata-portal.firebasestorage.app",
  messagingSenderId: "235424516733",
  appId: "1:235424516733:web:f7583b8fe4e5c4320eff14",
  measurementId: "G-QTFDG3F149"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
