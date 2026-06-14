const firebaseConfig = {
  apiKey: "uKGsONQ_AR0-MqV6IQUQLDBwG0dNIZm7fBBcSmmR-YU",
  authDomain: "sahayata-portal.firebaseapp.com",
  projectId: "sahayata-portal",
  storageBucket: "sahayata-portal.appspot.com",
  messagingSenderId: "PASTE_YOUR_SENDER_ID",
  appId: "PASTE_YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
