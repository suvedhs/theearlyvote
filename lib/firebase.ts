import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCE4rlIz24mYuzMjvC0EJGtSo9PrZbBMTw",
  authDomain: "theearlyvote-9cd50.firebaseapp.com",
  projectId: "theearlyvote-9cd50",
  storageBucket: "theearlyvote-9cd50.appspot.com",
  messagingSenderId: "283709702046",
  appId: "1:283709702046:web:1135475765a756bfe6e08f",
  measurementId: "G-SEPCBS60M5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export async function getElectionData() {
  const res = await fetch('https://api.publicapis.org/entries');
  return res;
}