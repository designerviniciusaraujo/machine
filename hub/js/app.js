import {
    collection,
    getDocs,
    query,
    orderBy,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { db } from "../firebase/config.js";
import { logout } from "../services/sessionService.js";

import {
    criarTorrent,
    listarTorrents
} from "../services/torrentuploads.js";

// =====================================================
// CONFIG
// =====================================================

const SIDEBAR_KEY = "sidebarState";

// =====================================================
// TEMA
// =====================================================

function toggleTheme() {
    document.documentElement.classList.toggle("dark");
}

// =====================================================
// DROPDOWN
// =====================================================

document.addEventListener("click", (event) => {
    const button = event.target.closest(".dropdown-toggle");

    if (!button) return;

    button.parentElement.classList.toggle("open");
});

// =====================================================
// SIDEBAR
// =====================================================

function updateSidebarIcon(isOpen) {
    const icon = document.getElementById("sidebarToggleIcon");

    if (!icon || !window.lucide) return;

    icon.setAttribute(
        "data-lucide",
        isOpen
            ? "panel-left-close"
            : "panel-left-open"
    );

    lucide.createIcons();
}

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");

    if (!sidebar) {
        console.error("Sidebar não encontrada");
        return;
    }

    // MOBILE
    if (window.innerWidth < 1280) {
        const isClosed =
            sidebar.classList.contains("-translate-x-full");

        if (isClosed) {
            sidebar.classList.remove("-translate-x-full");
        } else {
            sidebar.classList.add("-translate-x-full");
        }

        return;
    }

    // DESKTOP
    sidebar.classList.toggle("collapsed");

    const isOpen =
        !sidebar.classList.contains("collapsed");

    localStorage.setItem(
        SIDEBAR_KEY,
        isOpen ? "open" : "closed"
    );

    updateSidebarIcon(isOpen);
}

function closeMobileSidebar() {
    if (window.innerWidth >= 1280) return;

    const sidebar =
        document.getElementById("sidebar");

    if (!sidebar) return;

    sidebar.classList.add("-translate-x-full");

    updateSidebarIcon(false);
}

// =====================================================
// RESTAURAR SIDEBAR
// =====================================================

function restoreSidebarState() {
    const sidebar =
        document.getElementById("sidebar");

    if (!sidebar) return;

    // MOBILE
    if (window.innerWidth < 1280) {
        sidebar.classList.add("-translate-x-full");
        updateSidebarIcon(false);
        return;
    }

    // DESKTOP
    const state =
        localStorage.getItem(SIDEBAR_KEY);

    const isOpen =
        state !== "closed";

    sidebar.classList.toggle(
        "collapsed",
        !isOpen
    );

    updateSidebarIcon(isOpen);
}

// =====================================================
// CLIQUE FORA - MOBILE
// =====================================================

document.addEventListener("click", (event) => {
    if (window.innerWidth >= 1280) return;

    const sidebar =
        document.getElementById("sidebar");

    if (!sidebar) return;

    if (
        sidebar.classList.contains(
            "-translate-x-full"
        )
    ) {
        return;
    }

    const clickedInside =
        sidebar.contains(event.target);

    const clickedToggle =
        event.target.closest(
            '[onclick="toggleSidebar()"]'
        );

    if (
        !clickedInside &&
        !clickedToggle
    ) {
        closeMobileSidebar();
    }
});

// =====================================================
// RESIZE
// =====================================================

window.addEventListener(
    "resize",
    restoreSidebarState
);

// =====================================================
// USER MENU
// =====================================================

function initUserMenu() {
    const userMenuBtn =
        document.getElementById("userMenuBtn");

    const userSidebar =
        document.getElementById("user-sidebar");

    if (
        !userMenuBtn ||
        !userSidebar
    ) {
        return;
    }

    userMenuBtn.onclick = () => {
        userSidebar.classList.toggle("hidden");
    };
}

// =====================================================
// HEADER
// =====================================================

function checkHeader() {
    const headerContainer =
        document.getElementById("header");

    if (!headerContainer) return;
}

checkHeader();

window.addEventListener(
    "resize",
    checkHeader
);

// =====================================================
// SWIPER
// =====================================================

function initSwiper() {
    const swiperElement =
        document.querySelector(".heroSwiper");

    if (
        !swiperElement ||
        typeof Swiper === "undefined"
    ) {
        return;
    }

    const progress =
        document.querySelector(".timeline-progress");

    if (!progress) return;

    const swiper =
        new Swiper(
            ".heroSwiper",
            {
                loop: true,

                effect: "fade",

                fadeEffect: {
                    crossFade: true
                },

                speed: 2500,

                autoplay: {
                    delay: 7000,
                    disableOnInteraction: false
                },

                allowTouchMove: false,

                keyboard: {
                    enabled: true
                }
            }
        );

    function startTimeline() {
        progress.style.transition = "none";
        progress.style.width = "0%";

        requestAnimationFrame(() => {
            progress.style.transition =
                "width 7000ms linear";

            progress.style.width = "100%";
        });
    }

    startTimeline();

    swiper.on(
        "slideChangeTransitionStart",
        startTimeline
    );
}

// =====================================================
// USUÁRIOS
// =====================================================

async function carregarUsuarios() {
    const usersList =
        document.getElementById("usersList");

    if (!usersList) return;

    usersList.innerHTML = "";

    try {
        const snapshot =
            await getDocs(
                collection(
                    db,
                    "users"
                )
            );

        snapshot.forEach((doc) => {
            const user =
                doc.data();

            const inicial =
                (
                    user.name ||
                    user.email ||
                    "?"
                )
                    .charAt(0)
                    .toUpperCase();

            usersList.innerHTML += `
                <tr class="hover:bg-white/5 transition">

                    <td class="px-6 py-4">

                        <div class="flex items-center gap-3">

                            <div
                                class="
                                    w-10
                                    h-10
                                    rounded-xl
                                    bg-[#5864be]
                                    text-white
                                    flex
                                    items-center
                                    justify-center
                                    font-semibold
                                "
                            >
                                ${inicial}
                            </div>

                            <span class="font-medium">
                                ${user.name || ""}
                            </span>

                        </div>

                    </td>

                    <td class="px-6 py-4 text-zinc-400">
                        ${user.email || ""}
                    </td>

                    <td class="px-6 py-4">
                        ${user.role || ""}
                    </td>

                    <td class="px-6 py-4">
                        ${user.downloads ?? 0}
                    </td>

                    <td class="px-6 py-4">

                        <span
                            class="
                                px-3
                                py-1
                                rounded-full
                                text-xs
                                ${
                                    user.status === "active"
                                        ? "bg-green-500/20 text-green-400"
                                        : "bg-red-500/20 text-red-400"
                                }
                            "
                        >
                            ${user.status || ""}
                        </span>

                    </td>

                    <td class="px-6 py-4">

                        <div class="flex justify-end gap-2">

                            <button
                                type="button"
                                class="
                                    px-3
                                    py-2
                                    rounded-lg
                                    bg-zinc-700
                                    hover:bg-zinc-600
                                "
                            >
                                Editar
                            </button>

                            <button
                                type="button"
                                class="
                                    px-3
                                    py-2
                                    rounded-lg
                                    bg-red-500/20
                                    text-red-400
                                    hover:bg-red-500/30
                                "
                            >
                                Banir
                            </button>

                        </div>

                    </td>

                </tr>
            `;
        });

    } catch (error) {
        console.error(
            "Erro ao carregar usuários:",
            error
        );
    }
}

// =====================================================
// MENU ATIVO
// =====================================================

function setActiveMenu(page) {
    document
        .querySelectorAll("[data-page]")
        .forEach((el) => {
            el.classList.remove(
                "bg-[#5864be]",
                "text-white"
            );
        });

    const active =
        document.querySelector(
            `[data-page="${page}"]`
        );

    if (active) {
        active.classList.add(
            "bg-[#5864be]",
            "text-white"
        );
    }
}

// =====================================================
// INCLUDE
// =====================================================

async function include(id, file) {
    const el =
        document.getElementById(id);

    if (!el) {
        console.error(
            `Elemento "${id}" não encontrado.`
        );

        return;
    }

    try {
        const response =
            await fetch(file);

        if (!response.ok) {
            throw new Error(
                `${response.status} - ${file}`
            );
        }

        const html =
            await response.text();

        el.innerHTML = html;

    } catch (error) {
        console.error(
            `Erro ao incluir ${file}:`,
            error
        );
    }
}

// =====================================================
// NAVEGAÇÃO
// =====================================================

document.addEventListener(
    "click",
    (event) => {
        const link =
            event.target.closest("[data-page]");

        if (!link) return;

        event.preventDefault();

        const page =
            link.dataset.page;

        if (!page) return;

        loadPage(page);
    }
);

// =====================================================
// LOAD PAGE
// =====================================================

async function loadPage(
    page,
    updateHistory = true
) {
    if (!page) {
        page = "home";
    }

    const cleanPage =
        String(page)
            .replace(/\.html$/i, "")
            .replace(
                /[^a-zA-Z0-9_-]/g,
                ""
            );

    const content =
        document.getElementById("content");

    if (!content) {
        console.error(
            'Elemento "content" não encontrado.'
        );

        return;
    }

    content.innerHTML = `
        <div
            class="
                p-10
                flex
                items-center
                justify-center
                text-zinc-500
            "
        >
            Carregando...
        </div>
    `;

    try {
        const response =
            await fetch(
                `./pages/${cleanPage}.html`,
                {
                    cache: "no-cache"
                }
            );

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}`
            );
        }

        const html =
            await response.text();

        content.innerHTML = html;

        // URL
        if (updateHistory) {
            const url =
                new URL(
                    window.location.href
                );

            url.searchParams.set(
                "page",
                cleanPage
            );

            history.pushState(
                {
                    page: cleanPage
                },
                "",
                url
            );
        }

        // Menu
        setActiveMenu(cleanPage);

        // Lucide
        if (window.lucide) {
            lucide.createIcons();
        }

        // Usuários
        carregarUsuarios();

        // User menu
        initUserMenu();

        // Sidebar
        restoreSidebarState();

        // HOME
        if (cleanPage === "home") {
            requestAnimationFrame(() => {
                initSwiper();
            });
        }

        // UPLOAD TORRENT
        if (cleanPage === "upload") {
            requestAnimationFrame(() => {
                initTorrents();
            });
        }

        // LISTA TORRENTS
        if (cleanPage === "torrents") {
            requestAnimationFrame(() => {
                carregarTorrents();
            });
        }

    } catch (error) {
        console.error(
            "Erro ao carregar página:",
            cleanPage,
            error
        );

        content.innerHTML = `
            <div
                class="
                    m-6
                    p-6
                    rounded-2xl
                    border
                    border-red-500/20
                    bg-red-500/5
                    text-red-400
                "
            >
                <p class="font-semibold">
                    Erro ao carregar a página
                </p>

                <p class="text-sm mt-2 text-red-400/70">
                    ${cleanPage}
                </p>

                <p class="text-xs mt-3 text-zinc-500">
                    Verifique se existe:
                    ./pages/${cleanPage}.html
                </p>
            </div>
        `;
    }
}

// =====================================================
// UPLOAD TORRENT
// =====================================================

async function initTorrents() {
    const form =
        document.getElementById(
            "torrentUploadForm"
        );

    if (!form) {
        console.error(
            "Formulário torrent não encontrado."
        );

        return;
    }

    const fileInput =
        document.getElementById(
            "torrentFile"
        );

    const dropZone =
        document.getElementById(
            "dropZone"
        );

    const selectedFile =
        document.getElementById(
            "selectedFile"
        );

    const fileName =
        document.getElementById(
            "fileName"
        );

    const fileSize =
        document.getElementById(
            "fileSize"
        );

    const removeFile =
        document.getElementById(
            "removeFile"
        );

    const publishBtn =
        document.getElementById(
            "publishBtn"
        );

    let arquivoSelecionado = null;

    // ---------------------------------------------
    // ARQUIVO
    // ---------------------------------------------

    function atualizarArquivo(file) {
        if (!file) return;

        if (
            !file.name
                .toLowerCase()
                .endsWith(".torrent")
        ) {
            alert(
                "Selecione apenas um arquivo .torrent"
            );

            return;
        }

        arquivoSelecionado = file;

        fileName.textContent =
            file.name;

        fileSize.textContent =
            (
                file.size /
                1024 /
                1024
            ).toFixed(2) + " MB";

        selectedFile.classList.remove(
            "hidden"
        );

        publishBtn.disabled = false;

        publishBtn.classList.remove(
            "opacity-30",
            "cursor-not-allowed"
        );
    }

    // ---------------------------------------------
    // INPUT
    // ---------------------------------------------

    fileInput.addEventListener(
        "change",
        () => {
            atualizarArquivo(
                fileInput.files[0]
            );
        }
    );

    // ---------------------------------------------
    // DRAG
    // ---------------------------------------------

    dropZone.addEventListener(
        "dragover",
        (e) => {
            e.preventDefault();

            dropZone.classList.add(
                "border-[#5864be]"
            );
        }
    );

    dropZone.addEventListener(
        "dragleave",
        () => {
            dropZone.classList.remove(
                "border-[#5864be]"
            );
        }
    );

    dropZone.addEventListener(
        "drop",
        (e) => {
            e.preventDefault();

            dropZone.classList.remove(
                "border-[#5864be]"
            );

            atualizarArquivo(
                e.dataTransfer.files[0]
            );
        }
    );

    // ---------------------------------------------
    // REMOVER
    // ---------------------------------------------

    removeFile.addEventListener(
        "click",
        () => {
            arquivoSelecionado = null;

            fileInput.value = "";

            selectedFile.classList.add(
                "hidden"
            );

            publishBtn.disabled = true;

            publishBtn.classList.add(
                "opacity-30",
                "cursor-not-allowed"
            );
        }
    );

    // ---------------------------------------------
    // PUBLICAR
    // ---------------------------------------------

    form.addEventListener(
        "submit",
        async (e) => {
            e.preventDefault();

            if (!arquivoSelecionado) {
                alert(
                    "Selecione um arquivo .torrent"
                );

                return;
            }

            publishBtn.disabled = true;

            publishBtn.textContent =
                "Publicando...";

            try {
                await criarTorrent({
                    nome:
                        document.getElementById(
                            "title"
                        ).value,

                    descricao:
                        document.getElementById(
                            "description"
                        ).value,

                    categoria:
                        document.getElementById(
                            "category"
                        ).value,

                    tags:
                        document.getElementById(
                            "tags"
                        ).value,

                    arquivoNome:
                        arquivoSelecionado.name,

                    arquivoTamanho:
                        arquivoSelecionado.size,

                    tipo:
                        document.getElementById(
                            "category"
                        ).value,

                    seeders: 0,

                    leechers: 0,

                    completions: 0,

                    tamanho:
                        (
                            arquivoSelecionado.size /
                            1024 /
                            1024
                        ).toFixed(2) +
                        " MB",

                    grupo: "FK",

                    uploader: "Admin"
                });

                alert(
                    "Torrent publicado com sucesso!"
                );

                form.reset();

                arquivoSelecionado = null;

                selectedFile.classList.add(
                    "hidden"
                );

                publishBtn.disabled = true;

                publishBtn.textContent =
                    "Publicar Torrent";

                publishBtn.classList.add(
                    "opacity-30",
                    "cursor-not-allowed"
                );

            } catch (error) {
                console.error(
                    "Erro ao publicar torrent:",
                    error
                );

                alert(
                    "Erro ao publicar torrent."
                );

                publishBtn.disabled = false;

                publishBtn.textContent =
                    "Publicar Torrent";
            }
        }
    );
}

// =====================================================
// LISTAR TORRENTS
// =====================================================

async function carregarTorrents() {
    try {
        const torrents =
            await listarTorrents();

        const tbody =
            document.getElementById(
                "torrentTableBody"
            );

        if (!tbody) {
            console.warn(
                "torrentTableBody não encontrado."
            );

            return;
        }

        tbody.innerHTML =
            torrents
                .map(
                    (torrent) => `
                        <tr class="border-b border-white/5 hover:bg-white/5 transition">

                            <td class="px-5 py-4">

                                <div class="flex items-center gap-3">

                                    <div
                                        class="
                                            w-10
                                            h-10
                                            rounded-xl
                                            bg-[#5864be]/20
                                            flex
                                            items-center
                                            justify-center
                                        "
                                    >
                                        <img
                                            src="./assets/images/free.gif"
                                            alt=""
                                        >
                                    </div>

                                    <div>

                                        <p class="font-semibold text-white">
                                            ${torrent.nome || "Sem nome"}
                                        </p>

                                        <p class="text-xs text-zinc-500">
                                            ${torrent.tipo || ""}
                                            •
                                            ${torrent.qualidade || ""}
                                            •
                                            ${torrent.codec || ""}
                                        </p>

                                    </div>

                                </div>

                            </td>

                            <td class="text-center text-zinc-300">
                                ${torrent.tipo || "-"}
                            </td>

                            <td class="text-center">

                                <button
                                    type="button"
                                    class="
                                        w-9
                                        h-9
                                        rounded-lg
                                        bg-[#5864be]
                                        text-white
                                    "
                                >
                                    ↓
                                </button>

                            </td>

                            <td class="text-center font-bold text-green-400">
                                ${torrent.seeders || 0}
                            </td>

                            <td class="text-center font-bold text-orange-400">
                                ${torrent.leechers || 0}
                            </td>

                            <td class="text-center text-zinc-300">
                                ${torrent.completions || 0}
                            </td>

                            <td class="text-center text-zinc-300">
                                ${torrent.tamanho || "-"}
                            </td>

                            <td class="text-center text-[#93a0ff] font-medium">
                                ${torrent.grupo || "-"}
                            </td>

                            <td class="text-center text-zinc-300">
                                ${torrent.uploader || "-"}
                            </td>

                        </tr>
                    `
                )
                .join("");

    } catch (error) {
        console.error(
            "Erro ao carregar torrents:",
            error
        );
    }
}

// =====================================================
// NOTIFICAÇÕES
// =====================================================

function loadNotifications() {
    const notificationCount =
        document.getElementById(
            "notificationCount"
        );

    const notificationList =
        document.getElementById(
            "notificationList"
        );

    if (!notificationList) {
        return;
    }

    const q =
        query(
            collection(
                db,
                "notifications"
            ),
            orderBy(
                "createdAt",
                "desc"
            )
        );

    onSnapshot(
        q,
        (snapshot) => {
            if (notificationCount) {
                notificationCount.textContent =
                    snapshot.size;

                notificationCount.classList.toggle(
                    "hidden",
                    snapshot.size === 0
                );
            }

            notificationList.innerHTML = "";

            snapshot.forEach((doc) => {
                const data =
                    doc.data();

                const loginDate =
                    data.createdAt?.toDate
                        ? data.createdAt.toDate()
                        : new Date(
                            data.createdAt
                        );

                const formattedDate =
                    loginDate.toLocaleString(
                        "pt-BR",
                        {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    );

                notificationList.innerHTML += `
                    <div
                        class="
                            p-3
                            rounded-xl
                            bg-slate-800
                            border
                            border-slate-700
                        "
                    >

                        <h4
                            class="
                                text-white
                                font-semibold
                                text-sm
                            "
                        >
                            ${data.title || ""}
                        </h4>

                        <p
                            class="
                                text-slate-400
                                text-sm
                            "
                        >
                            ${data.message || ""}
                        </p>

                        <div
                            class="
                                mt-2
                                flex
                                items-center
                                gap-2
                            "
                        >

                            <i
                                data-lucide="clock"
                                class="
                                    w-3
                                    h-3
                                    text-indigo-400
                                "
                            ></i>

                            <span
                                class="
                                    text-xs
                                    text-slate-500
                                "
                            >
                                ${formattedDate}
                            </span>

                        </div>

                    </div>
                `;
            });

            if (window.lucide) {
                lucide.createIcons();
            }
        }
    );
}

// =====================================================
// LOGOUT
// =====================================================

function initLogout() {
    document
        .querySelectorAll("[data-logout]")
        .forEach((button) => {

            button.onclick = async () => {

                const confirmed =
                    confirm(
                        "Deseja realmente sair do sistema?"
                    );

                if (!confirmed) {
                    return;
                }

                await logout();
            };

        });
}

// =====================================================
// INICIALIZAÇÃO
// =====================================================

async function init() {
    console.log(
        "Portal OMDA iniciando..."
    );

    // Componentes
    await include(
        "header",
        "./componentes/header.html"
    );

    await include(
        "footer",
        "./componentes/footer.html"
    );

    await include(
        "box-sidebar",
        "./componentes/sidebar.html"
    );

    // Depois dos includes
    restoreSidebarState();

    initUserMenu();

    initLogout();

    // Página inicial
    const params =
        new URLSearchParams(
            window.location.search
        );

    const initialPage =
        params.get("page") ||
        "home";

    await loadPage(
        initialPage,
        false
    );

    // Notificações
    loadNotifications();

    console.log(
        "Portal OMDA pronto."
    );
}

// =====================================================
// HISTÓRICO DO NAVEGADOR
// =====================================================

window.addEventListener(
    "popstate",
    () => {

        const params =
            new URLSearchParams(
                window.location.search
            );

        const page =
            params.get("page") ||
            "home";

        loadPage(
            page,
            false
        );
    }
);

// =====================================================
// GLOBAL
// =====================================================

window.loadPage =
    loadPage;

window.toggleSidebar =
    toggleSidebar;

window.toggleTheme =
    toggleTheme;

// =====================================================
// START
// =====================================================

init();