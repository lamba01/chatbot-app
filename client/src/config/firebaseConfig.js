import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyACMzIMxWVTpCTvpF7hsz6aBAAQSmSSeGU",
  authDomain: "chatauth-54f21.firebaseapp.com",
  projectId: "chatauth-54f21",
  storageBucket: "chatauth-54f21.firebasestorage.app",
  messagingSenderId: "659335782312",
  appId: "1:659335782312:web:073d2fc3d2f5f521fdc79d",
  measurementId: "G-X6VQCREQM4",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
