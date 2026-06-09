import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAiCyvd7Yx6E68iFEHu7phjIxyUshixLKg",
  authDomain: "baawa-medicals.firebaseapp.com",
  projectId: "baawa-medicals",
  storageBucket: "baawa-medicals.firebasestorage.app",
  messagingSenderId: "406265587881",
  appId: "1:406265587881:web:4015da80c75173b7ae21b8",
  measurementId: "G-9DKJDLFYVZ",
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
