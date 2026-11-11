import {
    collection,
    addDoc,
    getDocs,
    serverTimestamp,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { db } from "../firebase/config.js";

const ref = collection(db, "torrentuploads");

export async function criarTorrent(dados) {
    return await addDoc(ref, {
        ...dados,
        seeders: Number(dados.seeders) || 0,
        leechers: Number(dados.leechers) || 0,
        completions: Number(dados.completions) || 0,
        createdAt: serverTimestamp()
    });
}

export async function listarTorrents() {
    const q = query(ref, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}