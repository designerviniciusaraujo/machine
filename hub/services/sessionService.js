 
import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"

import { auth, db } from "../firebase/config.js"




 
window.currentUser = null

const authListeners = []


export function updateUserComponents(user) {

    if (!user) return;

    const bindings = {
        "data-user-name": user.name,
        "data-user-email": user.email,
        "data-user-role": user.role,
        "data-user-phone": user.phone,
        "data-user-uid": user.uid,
        "data-user-status": user.active ? "Online" : "Offline"
    };

    Object.entries(bindings).forEach(([attribute, value]) => {

        document.querySelectorAll(`[${attribute}]`).forEach(el => {

            el.textContent = value ?? "-";

        });

    });

    document.querySelectorAll("[data-user-photo]").forEach(img => {

        img.src = user.photoURL || "assets/images/avatar.png";

    });

}
export function onUserAuthenticated(callback) {
    authListeners.push(callback)
}

function emitAuthenticated(user) {

    authListeners.forEach(listener => {
//    console.log("Emitindo autenticação", user);
        try {
            listener(user)
        } catch (error) {
            console.error("Erro ao executar listener de autenticação:", error)
        }

    })

}


export async function logout() {

    try {

        await signOut(auth);

        localStorage.removeItem("user");
        window.currentUser = null;

        window.location.href = "/auth/"; /// ajuste para sua rota

    } catch (error) {

        console.error("Erro ao sair:", error);

    }

}
export function initSession(callback) {

    onAuthStateChanged(auth, async (user) => {

        if (user) {

            const snap = await getDoc(doc(db, "users", user.uid))

            window.currentUser = {
                uid: user.uid,
                email: user.email,
                ...(snap.exists() ? snap.data() : {})
            }

            localStorage.setItem("user", JSON.stringify(window.currentUser))
            emitAuthenticated(window.currentUser);
            updateUserComponents(window.currentUser);
        } else {

            window.currentUser = null
            localStorage.removeItem("user")
        }

        if (callback) callback(window.currentUser)
    })
}

export function getUser() {
    return window.currentUser || JSON.parse(localStorage.getItem("user"))
}