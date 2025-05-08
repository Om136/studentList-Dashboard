import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC0b3jBZqi6p0NBq7D5ITwp94OECHJBLxY",
  authDomain: "student-dashboard-4191c.firebaseapp.com",
  projectId: "student-dashboard-4191c",
  storageBucket: "student-dashboard-4191c.firebasestorage.app",
  messagingSenderId: "536160991075",
  appId: "1:536160991075:web:db0a209916d2409e1a8556",
  measurementId: "G-R102J5ZM76",
};

// Initialize Firebase with explicit options
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Configure Google Auth Provider with all necessary scopes
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("profile");
googleProvider.addScope("email");
googleProvider.setCustomParameters({
  prompt: "select_account",
});
