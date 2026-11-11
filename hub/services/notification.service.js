import {
    addDoc,
    collection,
    Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { db } from "../firebase/config.js";
import { onUserAuthenticated } from "./sessionService.js";


async function createNotification(user) {

    try {

        // console.log("Usuário autenticado:", user);


        // Verifica se é sysops
        if (user.role !== "sysops") {
            // console.log("Usuário não é sysops. Notificação ignorada.");
            return;
        }


        // console.log("Usuário sysops detectado:");
        console.log({
            uid: user.uid,
            nome: user.name,
            email: user.email,
            role: user.role
        });


        const docRef = await addDoc(collection(db, "notifications"), {

            type: "login",
            title: "Novo login SysOps",
            message: `${user.name} entrou no sistema.`,

            userId: user.uid,
            userName: user.name,
            userRole: user.role,

            createdAt: new Date()

        });


        // console.log("Notificação criada:", docRef.id);


    } catch (error) {

        console.error("Erro ao criar notificação:", error);

    }

}

onUserAuthenticated(async (user) => {
    
    await createNotification(user);
    

    // console.log("Notificação criada!");

});