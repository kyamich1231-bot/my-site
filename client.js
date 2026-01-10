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

const messagesDiv = document.getElementById("messages");
const usersDiv = document.getElementById("users");

let username = localStorage.getItem("username");
let localMessages = JSON.parse(localStorage.getItem("messages")) || [];

// Всегда сначала показываем регистрацию
login.classList.remove("hidden");
chat.classList.add("hidden");

startBtn.onclick = () => {
  const name = nameInput.value.trim();
  if (!name) return alert("Введите ник!");

  username = name;
  localStorage.setItem("username", name);

  login.classList.add("hidden");
  chat.classList.remove("hidden");

  socket.emit("join", username);
};

// Emoji
emojiBtn.onclick = () => {
  msgInput.value += "😀";
  msgInput.focus();
};

// Отправка текста
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

// Файл (картинка)
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

// Получение сообщений
socket.on("message", msg => {
  localMessages.push(msg);
  localStorage.setItem("messages", JSON.stringify(localMessages));
  addMessage(msg);
});

// Онлайн пользователи
socket.on("users", users => {
  usersDiv.innerHTML = "";
  users.forEach(u => {
    const div = document.createElement("div");
    div.className = "user";
    div.innerText = u;
    usersDiv.appendChild(div);
  });
});

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

  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
