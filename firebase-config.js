const firebaseConfig = {
  apiKey: "AIzaSyA8kOUKLKWW84J1JL0mVW9auF9QP_N7jW8",
  authDomain: "sahayata-portal.firebaseapp.com",
  projectId: "sahayata-portal",
  storageBucket: "sahayata-portal.firebasestorage.app",
  messagingSenderId: "235424516733",
  appId: "1:235424516733:web:f7583b8fe4e5c4320eff14"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firestore reference
const db = firebase.firestore();
