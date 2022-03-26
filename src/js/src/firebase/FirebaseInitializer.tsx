// Import the functions you need from the SDKs you need
import { getFirestore } from "firebase/firestore"
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDqA6EBNcxJBAXCsZHvj0fsR_lN1aSadM4",
    authDomain: "cssundays.firebaseapp.com",
    projectId: "cssundays",
    storageBucket: "cssundays.appspot.com",
    messagingSenderId: "844727159409",
    appId: "1:844727159409:web:4b1c45fdf0d9e8c7f0a9d0",
    measurementId: "G-K5C30HQ7VB"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);