
/* Rationale:
Firebase integration for OAuth authentication and analytics in cryptocurrency trading platform.
We use Firebase Auth for Google Sign-in and analytics for user behavior tracking. */

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth'

// TODO: SECURITY CRITICAL - Move to environment variables before production
// Because multiple Firebase projects exist for different environments, we keep old config commented for reference
// const firebaseConfig = {
//     apiKey: "AIzaSyDp5rzbb21-eF3R-P0di4zmLp6eHpy-VwA",
//     authDomain: "onnbitnew.firebaseapp.com",
//     databaseURL: "https://onnbitnew-default-rtdb.firebaseio.com",
//     projectId: "onnbitnew",
//     storageBucket: "onnbitnew.firebasestorage.app",
//     messagingSenderId: "302017664970",
//     appId: "1:302017664970:web:81161bb94f9e59e933e133",
//     measurementId: "G-71Y2YFBDFN"
// };

// Because we're using the current production Firebase project, these credentials are active
const firebaseConfig = {
    apiKey: "AIzaSyAaoab1uf_atxZYY_ooIOqxiNJ5LLBbvqI",
    authDomain: "onnbit-249c8.firebaseapp.com",
    projectId: "onnbit-249c8",
    storageBucket:  "onnbit-249c8.firebasestorage.app",
    messagingSenderId:  "363004121869",
    appId: "1:363004121869:web:6f374ff99ced91bfbe9644",
    measurementId: "G-QJWWH74HL4"
};


// Because Firebase requires initialization before using any services, we initialize the app first
const app = initializeApp(firebaseConfig);
// Because user behavior analytics help improve trading UX, we enable Firebase Analytics
const analytics = getAnalytics(app);
// Because OAuth login provides trusted identity verification for traders, we initialize Firebase Auth
export const auth = getAuth(app);
