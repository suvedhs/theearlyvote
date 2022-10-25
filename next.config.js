/**
 * @type {import('next').NextConfig}
 */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const nextConfig = {
  env: {
    FIREBASE_CONFIG: {
      apiKey: "AIzaSyCE4rlIz24mYuzMjvC0EJGtSo9PrZbBMTw",
      authDomain: "theearlyvote-9cd50.firebaseapp.com",
      projectId: "theearlyvote-9cd50",
      storageBucket: "theearlyvote-9cd50.appspot.com",
      messagingSenderId: "283709702046",
      appId: "1:283709702046:web:1135475765a756bfe6e08f",
      measurementId: "G-SEPCBS60M5"
    }
  }
}

module.exports = nextConfig