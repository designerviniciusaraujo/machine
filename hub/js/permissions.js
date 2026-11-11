// perm.js

import { onAuthStateChanged } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { doc, getDoc } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { auth, db } from "../../firebase/config.js";


const permissions = {

    ops: ["home", "uploads", "torrents", "usuarios", "perfil", "detalhe"],

    admin: ["home", "uploads", "torrents", "usuarios", "perfil", "detalhe"],

    user: ["home", "torrents", "perfil", "detalhe"]

};


function updateSidebar(role) {

    const allowed = permissions[role] || [];

    // Role no card
    const roleElement = document.querySelector("#sidebar [data-user-role]");

    if (roleElement) {
        roleElement.textContent = role;
    }

    // Itens do menu
    document.querySelectorAll("#sidebar [data-page]").forEach(item => {

        const page = item.dataset.page;

        item.classList.toggle(
            "hidden",
            !allowed.includes(page)
        );

    });

}


onAuthStateChanged(auth, async (user) => {

    if (!user) return;

    const snapshot = await getDoc(
        doc(db, "users", user.uid)
    );

    if (!snapshot.exists()) return;

    const { role } = snapshot.data();

    updateSidebar(role);

});