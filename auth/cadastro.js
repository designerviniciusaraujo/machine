import {
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    auth,
    db
} from "../firebase/config.js";


const form = document.getElementById("registerForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");

const registerButton = document.getElementById("registerButton");
const status = document.getElementById("registerStatus");


function showStatus(message, error = false) {

    status.textContent = message;

    status.className = error
        ? "mt-4 min-h-[18px] text-center text-[11px] text-red-400"
        : "mt-4 min-h-[18px] text-center text-[11px] text-white/40";
}


form.addEventListener("submit", async (event) => {

    event.preventDefault();


    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;


    if (!name) {

        showStatus(
            "Digite seu nome.",
            true
        );

        return;
    }


    if (password.length < 6) {

        showStatus(
            "A senha precisa ter pelo menos 6 caracteres.",
            true
        );

        return;
    }


    if (password !== confirmPassword) {

        showStatus(
            "As senhas não coincidem.",
            true
        );

        return;
    }


    try {

        registerButton.disabled = true;

        showStatus("Criando sua conta...");


        /* =========================
           FIREBASE AUTH
        ========================= */

        const result =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );


        const user = result.user;


        /* =========================
           NOME DO USUÁRIO
        ========================= */

        await updateProfile(user, {
            displayName: name
        });


        /* =========================
           FIRESTORE
        ========================= */

        await setDoc(
            doc(db, "users", user.uid),
            {
                uid: user.uid,
                name: name,
                email: email,
                photoURL: user.photoURL || "",
                role: "user",
                active: true,
                createdAt: serverTimestamp()
            }
        );


        /* =========================
           SUCESSO
        ========================= */

        showStatus(
            "Cadastro realizado com sucesso."
        );


        form.reset();


        setTimeout(() => {

            window.location.href = "./";

        }, 1500);


    } catch (error) {

        console.error(
            "Erro no cadastro:",
            error
        );


        switch (error.code) {

            case "auth/email-already-in-use":

                showStatus(
                    "Este e-mail já possui uma conta.",
                    true
                );

                break;


            case "auth/invalid-email":

                showStatus(
                    "Digite um e-mail válido.",
                    true
                );

                break;


            case "auth/weak-password":

                showStatus(
                    "A senha é muito fraca.",
                    true
                );

                break;


            case "auth/network-request-failed":

                showStatus(
                    "Erro de conexão. Tente novamente.",
                    true
                );

                break;


            default:

                showStatus(
                    "Não foi possível criar a conta.",
                    true
                );

        }


        registerButton.disabled = false;

    }

});