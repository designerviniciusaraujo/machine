import {
    criarTorrent,
    listarTorrents
} from "../serviços/torrentuploads.js";

export async function iniciarTorrents() {

    const form = document.getElementById("torrentForm");

    if (!form) return;

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        const dados = {
            nome: document.getElementById("torrentNome").value,
            tipo: document.getElementById("torrentTipo").value,
            qualidade: document.getElementById("torrentQualidade").value,
            codec: document.getElementById("torrentCodec").value,
            audio: document.getElementById("torrentAudio").value,
            tamanho: document.getElementById("torrentTamanho").value,
            grupo: document.getElementById("torrentGrupo").value,
            uploader: document.getElementById("torrentUploader").value,
            seeders: document.getElementById("torrentSeeders").value,
            leechers: document.getElementById("torrentLeechers").value,
            completions: document.getElementById("torrentCompletions").value
        };

        try {

            await criarTorrent(dados);

            form.reset();

            await carregarTorrents();

        } catch (error) {

            console.error("Erro ao cadastrar torrent:", error);

        }

    });

    await carregarTorrents();
}


async function carregarTorrents() {

    const torrents = await listarTorrents();

    console.log("Torrents:", torrents);

}