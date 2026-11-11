import {
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { auth, db } from "../firebase/config.js";


const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const loginButton = document.getElementById("loginButton");
const googleButton = document.getElementById("continueWithGoogle");
const status = document.getElementById("loginStatus");


function showStatus(message, error = false) {

    status.textContent = message;

    status.className = error
        ? "mt-4 min-h-[18px] text-center text-[11px] text-red-400"
        : "mt-4 min-h-[18px] text-center text-[11px] text-white/45";
}


async function redirectAfterLogin(user) {

    console.log("LOGIN OK:", user.email);
    console.log("UID:", user.uid);

    const userRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(userRef);

    let role = "user";

    if (!snapshot.exists()) {

        console.log("Criando usuário no Firestore...");

        await setDoc(userRef, {
            uid: user.uid,
            email: user.email || "",
            role: "user",
            createdAt: serverTimestamp()
        });

    } else {

        role = snapshot.data().role || "user";

        console.log("Usuário encontrado:", snapshot.data());
    }


    console.log("ROLE:", role);


    if (role === "ops") {

        window.location.href = "../hub/";
        return;
    }


    window.location.href = "../load.html";
}


/* LOGIN E-MAIL */

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {

        showStatus(
            "Preencha e-mail e senha.",
            true
        );

        return;
    }


    try {

        loginButton.disabled = true;

        showStatus("Entrando...");

        console.log("Tentando login:", email);


        const result = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );


        await redirectAfterLogin(result.user);


    } catch (error) {

        console.error("ERRO:", error);

        switch (error.code) {

            case "auth/invalid-credential":
            case "auth/wrong-password":
            case "auth/user-not-found":

                showStatus(
                    "E-mail ou senha incorretos.",
                    true
                );

                break;

            case "auth/invalid-email":

                showStatus(
                    "Digite um e-mail válido.",
                    true
                );

                break;

            case "auth/too-many-requests":

                showStatus(
                    "Muitas tentativas. Tente novamente mais tarde.",
                    true
                );

                break;

            default:

                showStatus(
                    "Não foi possível entrar. Tente novamente.",
                    true
                );
        }

        loginButton.disabled = false;
    }

});


/* LOGIN GOOGLE */

googleButton.addEventListener("click", async () => {

    try {

        googleButton.disabled = true;

        showStatus("Conectando com Google...");


        const provider = new GoogleAuthProvider();

        const result = await signInWithPopup(
            auth,
            provider
        );


        await redirectAfterLogin(result.user);


    } catch (error) {

        console.error("ERRO GOOGLE:", error);

        if (error.code === "auth/popup-closed-by-user") {

            showStatus("");

        } else {

            showStatus(
                "Não foi possível entrar com Google.",
                true
            );
        }


        googleButton.disabled = false;
    }

});