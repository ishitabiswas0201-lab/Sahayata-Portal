// ============================================================
// FIREBASE CONFIGURATION
// ============================================================
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project (or use an existing one)
// 3. In Project Settings > General > "Your apps", click the
//    Web icon (</>) to register a new web app
// 4. Copy the config object Firebase gives you and paste the
//    values below, replacing the placeholders.
// 5. In the Firebase Console, go to "Build > Firestore Database"
//    and click "Create database" (start in test mode for local
//    development, then tighten security rules before going live).
// ============================================================

// TODO: Replace with your actual Firebase project config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase (using the compat/CDN SDK loaded in each HTML page)
firebase.initializeApp(firebaseConfig);

// Firestore database reference, used across all pages
const db = firebase.firestore();
