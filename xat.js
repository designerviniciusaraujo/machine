
/**
 * CHAT GLOBAL — WIDGET
 * Instalação:
 * <script src="https://SEU-DOMINIO.com/chat-global.js"></script>
 *
 * Firestore:
 * channels/{channelId}
 * channels/{channelId}/messages/{messageId}
 */

(() => {
  "use strict";

  if (window.__CHAT_GLOBAL_LOADED__) return;
  window.__CHAT_GLOBAL_LOADED__ = true;

  // ==========================================
  // CONFIGURAÇÕES
  // ==========================================

  const CONFIG = {
    firebase: {
      apiKey: "AIzaSyB0JYggDaO-7klT2f15N1rcF2C27uhA5ek",
      authDomain: "opsmac-e6d45.firebaseapp.com",
      projectId: "opsmac-e6d45",
      storageBucket: "opsmac-e6d45.firebasestorage.app",
      messagingSenderId: "913611355587",
      appId: "1:913611355587:web:3c383491b41346e3017976"
    },

    agent: {
      name: "Equipe de Atendimento",
      photo: "",
      status: "Online"
    },

    colors: {
      primary: "#16a34a",
      primaryDark: "#12833c"
    },

    position: {
      bottom: 20,
      right: 20
    },

    welcomeMessage: "Olá! Como podemos ajudar você?"
  };

  // ==========================================
  // FIREBASE
  // ==========================================

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = [...document.scripts].find(s => s.src === src);

      if (existing) {
        if (existing.dataset.loaded === "true") return resolve();
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        script.dataset.loaded = "true";
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async function initializeFirebase() {
    await loadScript(
      "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"
    );

    await loadScript(
      "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js"
    );

    const appName = "site-chat-widget";

    let firebaseApp = firebase.apps.find(app => app.name === appName);

    if (!firebaseApp) {
      firebaseApp = firebase.initializeApp(CONFIG.firebase, appName);
    }

    return firebaseApp.firestore();
  }

  // ==========================================
  // HELPERS
  // ==========================================

  const serverTimestamp = () =>
    firebase.firestore.FieldValue.serverTimestamp();

  const increment = value =>
    firebase.firestore.FieldValue.increment(value);

  const escapeHTML = value =>
    String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char]));

  function formatTime(timestamp) {
    if (!timestamp) return "";

    const date = timestamp.toDate
      ? timestamp.toDate()
      : new Date(timestamp);

    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function getInitials(name) {
    return String(name || "A")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(part => part[0])
      .join("")
      .toUpperCase();
  }

  // ==========================================
  // CRIAÇÃO DO CANAL
  // ==========================================

  let db;
  let channelRef;
  let messagesRef;
  let channelId;
  let unsubscribeMessages;
  let unsubscribeChannel;
  let chatClosed = false;
  let sending = false;
  let visitorName = "";
  let visitorHasSent = false;

  async function createChannel() {
    const ref = db.collection("channels").doc();

    const data = {
      channelId: "site",
      title: document.title || "Página sem título",
      url: location.href,
      domain: location.hostname,
      status: "open",

      client: {
        name: "Visitante"
      },

      lastMessage: "Novo visitante",
      unread: 0,

      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await ref.set(data);

    channelRef = ref;
    messagesRef = ref.collection("messages");
    channelId = ref.id;

    window.SiteChat = {
      channelId,
      close: closeWidget
    };

    return ref;
  }

  // ==========================================
  // INTERFACE
  // ==========================================

  const host = document.createElement("div");
  host.id = "chat-global-widget";
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: "open" });

  shadow.innerHTML = `
    <style>
      * {
        box-sizing: border-box;
      }

      :host {
        font-family: Arial, Helvetica, sans-serif;
        color: #172033;
      }

      button, input {
        font: inherit;
      }

      button {
        cursor: pointer;
      }

      .launcher {
        position: fixed;
        z-index: 2147483000;
        right: ${CONFIG.position.right}px;
        bottom: ${CONFIG.position.bottom}px;
        width: 62px;
        height: 62px;
        border: 0;
        border-radius: 50%;
        background: #25D366;
        color: white;
        display: grid;
        place-items: center;
        box-shadow: 0 5px 25px #0003;
        transition: transform .2s;
      }

      .launcher:hover {
        transform: scale(1.06);
      }

      .launcher svg {
        width: 33px;
        height: 33px;
      }

      .window {
        position: fixed;
        z-index: 2147483001;
        right: ${CONFIG.position.right}px;
        bottom: 96px;
        width: 370px;
        height: min(590px, calc(100dvh - 120px));
        background: #efeae2;
        border-radius: 17px;
        overflow: hidden;
        box-shadow: 0 10px 45px #0003;
        display: none;
        flex-direction: column;
      }

      .window.open {
        display: flex;
      }

      .header {
        background: #075e54;
        color: white;
        min-height: 68px;
        display: flex;
        align-items: center;
        gap: 11px;
        padding: 10px 14px;
      }

      .agent-photo {
        width: 43px;
        height: 43px;
        border-radius: 50%;
        flex: none;
        object-fit: cover;
        background: #d9eee4;
      }

      .agent-fallback {
        display: grid;
        place-items: center;
        color: #075e54;
        font-weight: bold;
      }

      .agent-info {
        min-width: 0;
        flex: 1;
      }

      .agent-name {
        font-size: 14px;
        font-weight: bold;
      }

      .agent-status {
        font-size: 11px;
        opacity: .8;
        margin-top: 4px;
      }

      .close {
        color: white;
        background: transparent;
        border: 0;
        font-size: 25px;
        padding: 5px;
      }

      .channel-info {
        background: #e1f3e9;
        padding: 7px 12px;
        text-align: center;
        font-size: 10px;
        color: #466455;
        overflow-wrap: anywhere;
      }

      .messages {
        flex: 1;
        overflow-y: auto;
        padding: 15px 12px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .message {
        max-width: 85%;
        align-self: flex-start;
        background: white;
        padding: 10px 12px;
        border-radius: 9px 9px 9px 2px;
        font-size: 13px;
        line-height: 1.45;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        box-shadow: 0 1px 1px #0001;
      }

      .message.customer {
        align-self: flex-end;
        background: #d9fdd3;
        border-radius: 9px 9px 2px 9px;
      }

      .message-time {
        display: block;
        text-align: right;
        color: #8b9990;
        font-size: 9px;
        margin-top: 5px;
      }

      .welcome {
        text-align: center;
        background: #fff;
        padding: 9px 12px;
        border-radius: 8px;
        font-size: 11px;
        color: #68756d;
        align-self: center;
        max-width: 90%;
        margin: 5px 0;
      }

      .visitor-form {
        background: #fff;
        padding: 10px;
        border-top: 1px solid #eee;
      }

      .visitor-form input {
        width: 100%;
        border: 1px solid #e3e7e4;
        border-radius: 8px;
        padding: 10px;
        outline: none;
        font-size: 13px;
      }

      .visitor-form input:focus {
        border-color: #25D366;
      }

      .composer {
        background: #f0f2f5;
        padding: 10px;
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .composer input {
        flex: 1;
        min-width: 0;
        border: 0;
        outline: none;
        background: white;
        border-radius: 25px;
        padding: 12px 15px;
        font-size: 13px;
      }

      .send {
        width: 42px;
        height: 42px;
        flex: none;
        border: 0;
        border-radius: 50%;
        background: #128c7e;
        color: white;
        display: grid;
        place-items: center;
      }

      .send:disabled {
        opacity: .45;
        cursor: not-allowed;
      }

      .send svg {
        width: 19px;
        height: 19px;
      }

      .closed {
        background: white;
        padding: 15px;
        text-align: center;
        color: #b42318;
        font-size: 12px;
      }

      @media(max-width: 600px) {
        .window {
          inset: 0;
          width: 100%;
          height: 100dvh;
          max-height: 100dvh;
          border-radius: 0;
        }

        .launcher {
          width: 58px;
          height: 58px;
          right: 16px;
          bottom: 16px;
        }

        .header {
          padding-top: max(12px, env(safe-area-inset-top));
        }

        .composer {
          padding-bottom: max(10px, env(safe-area-inset-bottom));
        }
      }
    </style>

    <button class="launcher" id="launcher" aria-label="Abrir atendimento">
      <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        <path d="M16 .5A15.4 15.4 0 0 0 2.7 23.7L.5 31.5l8-2.1A15.5 15.5 0 1 0 16 .5Zm0 28.2c-2.3 0-4.5-.6-6.5-1.8l-.5-.3-4.7 1.2 1.3-4.6-.3-.5a12.7 12.7 0 1 1 10.7 6Zm7-9.5c-.4-.2-2.3-1.1-2.7-1.2-.4-.1-.6-.2-.9.2-.3.4-1 1.2-1.2 1.5-.2.2-.5.3-.9.1-.4-.2-1.7-.6-3.2-2-1.2-1.1-2-2.4-2.2-2.8-.2-.4 0-.6.2-.8l.6-.7c.2-.2.3-.4.4-.7.1-.2 0-.5 0-.7l-1.2-2.8c-.3-.7-.6-.6-.9-.6h-.8c-.3 0-.7.1-1.1.5-.4.4-1.4 1.3-1.4 3.2s1.4 3.7 1.6 4c.2.3 2.8 4.3 6.8 6 .9.4 1.6.6 2.1.7.9.3 1.8.2 2.5.1.8-.1 2.3-.9 2.7-1.8.3-.9.3-1.7.2-1.8-.1-.2-.4-.3-.8-.5Z"/>
      </svg>
    </button>

    <section class="window" id="window" aria-label="Chat de atendimento">
      <header class="header">
        <div id="agentAvatar"></div>
        <div class="agent-info">
          <div class="agent-name">${escapeHTML(CONFIG.agent.name)}</div>
          <div class="agent-status" id="agentStatus">${escapeHTML(CONFIG.agent.status)}</div>
        </div>
        <button class="close" id="close" aria-label="Fechar chat">×</button>
      </header>

      <div class="channel-info" id="channelInfo">
        Conectando ao atendimento...
      </div>

      <div class="messages" id="messages">
        <div class="welcome">${escapeHTML(CONFIG.welcomeMessage)}</div>
      </div>

      <div class="visitor-form" id="visitorForm">
        <input id="visitorName" maxlength="60" placeholder="Seu nome">
      </div>

      <div class="composer">
        <input id="messageInput" maxlength="2000" placeholder="Digite uma mensagem..." disabled>
        <button class="send" id="send" disabled aria-label="Enviar mensagem">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m22 2-7 20-4-9-9-4Z"/>
            <path d="M22 2 11 13"/>
          </svg>
        </button>
      </div>
    </section>
  `;

  // ==========================================
  // AVATAR DO ATENDENTE
  // ==========================================

  const agentAvatar = shadow.getElementById("agentAvatar");

  if (CONFIG.agent.photo) {
    agentAvatar.innerHTML = `
      <img class="agent-photo"
           src="${escapeHTML(CONFIG.agent.photo)}"
           alt="${escapeHTML(CONFIG.agent.name)}">
    `;
  } else {
    agentAvatar.innerHTML = `
      <div class="agent-photo agent-fallback">
        ${escapeHTML(getInitials(CONFIG.agent.name))}
      </div>
    `;
  }

  // ==========================================
  // ELEMENTOS
  // ==========================================

  const launcher = shadow.getElementById("launcher");
  const windowEl = shadow.getElementById("window");
  const closeButton = shadow.getElementById("close");
  const messagesEl = shadow.getElementById("messages");
  const visitorForm = shadow.getElementById("visitorForm");
  const visitorNameInput = shadow.getElementById("visitorName");
  const messageInput = shadow.getElementById("messageInput");
  const sendButton = shadow.getElementById("send");
  const channelInfo = shadow.getElementById("channelInfo");

  function openWidget() {
    windowEl.classList.add("open");
    launcher.style.display = "none";

    setTimeout(() => {
      if (!visitorHasSent) visitorNameInput.focus();
      else messageInput.focus();
    }, 100);
  }

  function closeWidget() {
    windowEl.classList.remove("open");
    launcher.style.display = "grid";
  }

  launcher.addEventListener("click", openWidget);
  closeButton.addEventListener("click", closeWidget);

  // ==========================================
  // NOME DO VISITANTE
  // ==========================================

  function updateInputState() {
    const name = visitorNameInput.value.trim();

    messageInput.disabled = !name || chatClosed;
    sendButton.disabled = !name || chatClosed;
  }

  visitorNameInput.addEventListener("input", updateInputState);

  // ==========================================
  // RENDER DE MENSAGENS
  // ==========================================

  function renderMessages(snapshot) {
    const previousScroll = messagesEl.scrollTop;
    const wasAtBottom =
      messagesEl.scrollHeight - messagesEl.clientHeight - previousScroll < 100;

    messagesEl.innerHTML = `
      <div class="welcome">${escapeHTML(CONFIG.welcomeMessage)}</div>
    `;

    snapshot.forEach(doc => {
      const message = doc.data();
      const isCustomer = message.sender === "customer";

      const element = document.createElement("div");
      element.className = "message " + (isCustomer ? "customer" : "agent");

      const text = document.createElement("span");
      text.textContent = message.text || "";

      const time = document.createElement("span");
      time.className = "message-time";
      time.textContent = formatTime(message.timestamp);

      element.appendChild(text);
      element.appendChild(time);
      messagesEl.appendChild(element);
    });

    if (wasAtBottom) {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
  }

  // ==========================================
  // ENVIO DE MENSAGEM
  // ==========================================

  async function sendMessage() {
    if (sending || chatClosed || !channelRef) return;

    const text = messageInput.value.trim();
    const name = visitorNameInput.value.trim();

    if (!name) {
      visitorNameInput.focus();
      return;
    }

    if (!text) return;

    sending = true;
    sendButton.disabled = true;

    try {
      const messageRef = messagesRef.doc();
      const batch = db.batch();
      const timestamp = serverTimestamp();

      batch.set(messageRef, {
        text,
        sender: "customer",
        timestamp
      });

      batch.update(channelRef, {
        client: { name },
        lastMessage: text,
        updatedAt: timestamp,
        unread: increment(1)
      });

      await batch.commit();

      visitorName = name;
      visitorHasSent = true;

      visitorNameInput.disabled = true;
      visitorForm.style.display = "none";

      messageInput.value = "";
      messageInput.focus();

    } catch (error) {
      console.error("[Chat Global] Erro ao enviar:", error);
      alert("Não foi possível enviar sua mensagem. Tente novamente.");
    } finally {
      sending = false;
      updateInputState();
    }
  }

  sendButton.addEventListener("click", sendMessage);

  messageInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  });

  // ==========================================
  // OBSERVAR CANAL E RESPOSTAS
  // ==========================================

  function subscribeToChannel() {
    unsubscribeMessages = messagesRef
      .orderBy("timestamp", "asc")
      .onSnapshot(renderMessages, error => {
        console.error("[Chat Global] Erro nas mensagens:", error);
      });

    unsubscribeChannel = channelRef.onSnapshot(snapshot => {
      if (!snapshot.exists) {
        setClosed();
        return;
      }

      const data = snapshot.data();

      if (data.status === "closed") {
        setClosed();
      }
    });
  }

  function setClosed() {
    chatClosed = true;
    messageInput.disabled = true;
    sendButton.disabled = true;

    const existing = shadow.querySelector(".closed");
    if (existing) return;

    const notice = document.createElement("div");
    notice.className = "closed";
    notice.textContent = "Este atendimento foi encerrado.";

    windowEl.appendChild(notice);
  }

  // ==========================================
  // INICIALIZAÇÃO
  // ==========================================

  async function start() {
    try {
      db = await initializeFirebase();

      await createChannel();

      channelInfo.textContent =
        "Canal: " + document.title + " · " + location.hostname;

      subscribeToChannel();

      console.info("[Chat Global] Canal criado:", channelId);

    } catch (error) {
      console.error("[Chat Global] Falha na inicialização:", error);

      channelInfo.textContent = "Atendimento temporariamente indisponível";
      messageInput.disabled = true;
      sendButton.disabled = true;
    }
  }

  start();

})();
