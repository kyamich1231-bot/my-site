const socket = io();

const login = document.getElementById("login");
const chat = document.getElementById("chat");
const startBtn = document.getElementById("startBtn");
const nameInput = document.getElementById("nameInput");

const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const emojiBtn = document.getElementById("emojiBtn");
const fileBtn = document.getElementById("fileBtn");
const fileInput = document.getElementById("fileInput");

const emojiPanel = document.getElementById("emojiPanel");
const imageViewer = document.getElementById("imageViewer");
const viewerImg = document.getElementById("viewerImg");

const messagesDiv = document.getElementById("messages");
const usersDiv = document.getElementById("users");

let username = null;

/* ❗ ВСЕГДА СНАЧАЛА РЕГИСТРАЦИЯ */
login.classList.remove("hidden");
chat.classList.add("hidden");

/* Вход */
startBtn.onclick = () => {
  const name = nameInput.value.trim();
  if (!name) return alert("Введите ник!");

  username = name;
  localStorage.setItem("username", name);

  login.classList.add("hidden");
  chat.classList.remove("hidden");

  socket.emit("join", username);
};

/* 😀 Emoji list */
const emojis = "😀 😁 😂 🤣 😃 😄 😅 😆 😉 😊 😋 😎 😍 😘 😜 🤪 🤨 🧐 🤓 😕 🙃 😏 😭 😡 🤬 🥶 🤯 😱 🤡 💩 👻 👽 🤖 🎃 ❤️ 🧡 💛 💚 💙 💜 🖤 🤍 👍 👎 👏 🙌 🤝 ✌️ 🤞 🤟 👌".split(" ");

emojis.forEach(e => {
  const span = document.createElement("div");
  span.className = "emoji";
  span.innerText = e;
  span.onclick = () => {
    msgInput.value += e;
    msgInput.focus();
  };
  emojiPanel.appendChild(span);
});

/* Emoji toggle */
emojiBtn.onclick = () => {
  emojiPanel.classList.toggle("hidden");
};

/* Отправка текста */
sendBtn.onclick = sendMessage;
msgInput.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = msgInput.value.trim();
  if (!text) return;

  socket.emit("message", {
    user: username,
    text
  });

  msgInput.value = "";
}

/* 📎 Фото */
fileBtn.onclick = () => fileInput.click();

fileInput.onchange = () => {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    socket.emit("message", {
      user: username,
      image: reader.result
    });
  };
  reader.readAsDataURL(file);
};

/* Сообщения */
socket.on("message", msg => {
  addMessage(msg);
});

/* Онлайн пользователи */
socket.on("users", users => {
  usersDiv.innerHTML = "";
  users.forEach(u => {
    const div = document.createElement("div");
    div.className = "user";
    div.innerText = u;
    usersDiv.appendChild(div);
  });
});

/* Рендер сообщения */
function addMessage(msg) {
  const div = document.createElement("div");
  div.className = "message";

  let content = "";
  if (msg.text) {
    content += `<div class="text">${msg.text}</div>`;
  }
  if (msg.image) {
    content += `<img src="${msg.image}">`;
  }

  div.innerHTML = `
    <div class="nick">${msg.user}</div>
    ${content}
  `;

  // Открытие картинки на весь экран
  const img = div.querySelector("img");
  if (img) {
    img.onclick = () => {
      viewerImg.src = img.src;
      imageViewer.classList.remove("hidden");
    };
  }

  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

/* Закрыть просмотр фото */
imageViewer.onclick = () => {
  imageViewer.classList.add("hidden");
};
