 

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { db } from "../../firebase/config.js";
console.log("22")
async function carregarUsuarios() {

    const usersList = document.getElementById("usersList");
    if (!usersList) {
        console.error("Elemento 'usersList' não encontrado.");
        return;
    }else{
        console.log("Elemento 'usersList' encontrado.");
        
    usersList.innerHTML = "";

    const snapshot = await getDocs(collection(db, "users"));

    snapshot.forEach((doc) => {

        const user = doc.data();
 
 const inicial = (user.name || user.email).charAt(0).toUpperCase();

usersList.innerHTML += `
<tr class="hover:bg-white/5 transition">

    <td class="px-6 py-4">

        <div class="flex items-center gap-3">

            <div class="w-10 h-10 rounded-xl bg-[#5864be] text-white flex items-center justify-center font-semibold">
                ${inicial}
            </div>

            <span class="font-medium">
                ${user.name}
            </span>

        </div>

    </td>

    <td class="px-6 py-4 text-zinc-400">
        ${user.email}
    </td>

    <td class="px-6 py-4">
        ${user.role}
    </td>

    <td class="px-6 py-4">
        ${user.downloads ?? 0}
    </td>

    <td class="px-6 py-4">

        <span class="px-3 py-1 rounded-full text-xs
        ${user.status === "active"
            ? "bg-green-500/20 text-green-400"
            : "bg-red-500/20 text-red-400"}">

            ${user.status}

        </span>

    </td>

    <td class="px-6 py-4">

        <div class="flex justify-end gap-2">

            <button class="px-3 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600">
                Editar
            </button>

            <button class="px-3 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30">
                Banir
            </button>

        </div>

    </td>

</tr>
`;
    });

    }
}


