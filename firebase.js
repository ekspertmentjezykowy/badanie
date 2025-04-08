const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, updateDoc, setDoc } = require('firebase/firestore');
const firebaseConfig = {
apiKey: "AIzaSyBN0LEUqfAW3XxAsSLfd1zxT_wrDUqBkZg",
  authDomain: "eksperymentjezykowy-83f29.firebaseapp.com",
  projectId: "eksperymentjezykowy-83f29",
  storageBucket: "eksperymentjezykowy-83f29.firebasestorage.app",
  messagingSenderId: "930905701853",
  appId: "1:930905701853:web:49073080eaf932fc1d8a34"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = { db, doc, getDoc, updateDoc, setDoc };