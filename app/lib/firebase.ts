import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyByY39Lhf0DUXV7VANrY-edZOcHLTFMsws",
  authDomain: "smart-pr-udicc.firebaseapp.com",
  projectId: "smart-pr-udicc",
  storageBucket: "smart-pr-udicc.firebasestorage.app",
  messagingSenderId: "494726540144",
  appId: "1:494726540144:web:10eb537f3346a38ef73db5",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);