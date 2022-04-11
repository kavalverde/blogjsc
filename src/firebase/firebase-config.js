import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBr8Ow7WAkO1P2HoiO3RHJOGnZgv5lXN6U",
  authDomain: "blogs-f4dc5.firebaseapp.com",
  projectId: "blogs-f4dc5",
  storageBucket: "blogs-f4dc5.appspot.com",
  messagingSenderId: "884415621015",
  appId: "1:884415621015:web:e51330b135e4431e02c6d2",
  measurementId: "G-VF2FJ1LQZN",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
