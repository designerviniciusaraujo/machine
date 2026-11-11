 
import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"

import { getAuth }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"

import { getFirestore }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"

const firebaseConfig = {

apiKey: "AIzaSyD-xzRjMRVUpey19g745DvPjjpCApqSHVE",
  authDomain: "myops-d7525.firebaseapp.com",
  projectId: "myops-d7525",
  storageBucket: "myops-d7525.firebasestorage.app",
  messagingSenderId: "247824192162",
  appId: "1:247824192162:web:77c91ab1e3df855dc7fdfb"

}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)

export const db = getFirestore(app)
 
 








