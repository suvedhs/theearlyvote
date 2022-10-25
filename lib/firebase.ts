import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
let firebaseConfig = process?.env?.FIREBASE_CONFIG ?? '{}';

// Initialize Firebase
let app, analytics, firestore
if (firebaseConfig?.projectId) {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);

  if (app.name && typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }

  // Access Firebase services using shorthand notation
  firestore = getFirestore();
}

export {analytics, firestore};

export async function getElectionData() {
  const res = await fetch('https://api.publicapis.org/entries');
  return res;
}