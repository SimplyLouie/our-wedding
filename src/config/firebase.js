import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyC9LA_PFA6KZ7s8IlQdJuolA0gaBm8kgNI",
    authDomain: "simply-louie.firebaseapp.com",
    projectId: "simply-louie",
    storageBucket: "simply-louie.firebasestorage.app",
    messagingSenderId: "822487405638",
    appId: "1:822487405638:web:078f7f6b9e968f80266647"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);