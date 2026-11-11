 
import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"

import { getAuth }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"

import { getFirestore }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"

const firebaseConfig = {

apiKey: "AIzaSyCUdvLKNzNyqmhRuPGl3OW16QDK4G8j2-A",
  authDomain: "engineomda.firebaseapp.com",
  projectId: "engineomda",
  storageBucket: "engineomda.firebasestorage.app",
  messagingSenderId: "151196305319",
  appId: "1:151196305319:web:f146670c5edc4cd0339882"

}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)

export const db = getFirestore(app)
 
 








