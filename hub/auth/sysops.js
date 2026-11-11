import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    auth,
    db
} from "../firebase/config.js";


const form = document.getElementById("loginForm");


form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;


    try {

        // LOGIN
        const result =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


        const uid = result.user.uid;


        localStorage.setItem("uid", uid);


        // BUSCA DADOS DO USUÁRIO
        const userRef =
            doc(db, "users", uid);

        const userSnap =
            await getDoc(userRef);


        if (!userSnap.exists()) {

            alert("Usuário não encontrado.");

            return;

        }


        const userData =
            userSnap.data();

        const role =
            userData.role;


        // USUÁRIO COMUM
        if (role === "user") {

            window.location.href = "/";

            return;

        }


        // ADMIN / SYSOPS / OUTROS
        simularLogin();

        setTimeout(() => {

            window.location.href = "./";

        }, 3000);


    } catch (err) {

        console.error(err);

        alert("Login inválido");

    }

});