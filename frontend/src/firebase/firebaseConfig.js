import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: import.meta.env.VITE.API.KEY,
  authDomain: import.meta.env.VITE.AUTHDOMAIN,
  projectId: import.meta.env.VITE.PROJECTID,
  storageBucket: import.meta.env.VITE.STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE.MESSAGINGSENDERID,
  appId: import.meta.env.VITE.APPID
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);