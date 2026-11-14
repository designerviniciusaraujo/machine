 
import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"

import { getAuth }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"

import { getFirestore }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"

const firebaseConfig = {
  apiKey: "AIzaSyDnJtEbBg94FWEkZ0j-nyqWN-VXhnD4IyU",
  authDomain: "machine-2c41d.firebaseapp.com",
  projectId: "machine-2c41d",
  storageBucket: "machine-2c41d.firebasestorage.app",
  messagingSenderId: "402989657148",
  appId: "1:402989657148:web:7b9080399c1c2a698d2739"

}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)

export const db = getFirestore(app)
 
 








