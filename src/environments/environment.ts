import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
  firebaseConfig: {
  apiKey: "AIzaSyCpPuoxEV4IG2YikyZyPoWX9OaPpYlvo0U",
  authDomain: "syspteste.firebaseapp.com",
  projectId: "syspteste",
  storageBucket: "syspteste.appspot.com",
  messagingSenderId: "555325683087",
  appId: "1:555325683087:web:88e49388ab29c2b6f307fa",
  measurementId: "G-6MT1Q7R1GY"
},

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

