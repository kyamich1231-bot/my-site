const socket = io();

const login = document.getElementById("login");
const chat = document.getElementById("chat");
const startBtn = document.getElementById("startBtn");
const nameInput = document.getElementById("nameInput");

const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const messagesDiv = document.getElementById("messages");

let username = localStorage.getItem("username");
let localMessages = JSON.parse(localStorage.getItem("messages")) || [];

// Восстановление после перезагрузки
if (username) {
  showChat();
}

// Отображаем локальные сообщения
localMessages.forEach(addMessage);

// Вход
startBtn.onclick = () => {
  const name = nameInput.value.trim();
  if (!name) return alert("Введите имя!");

  username = name;
  localStorage.setItem("username", name);
  showChat();
};

function showChat() {
  login.classList.add("hidden");
  chat.classList.remove("hidden");
}

// Отправка
sendBtn.onclick = sendMessage;
msgInput.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = msgInput.value.trim();
  if (!text) return;

  const msg = {
    user: username,
    text: text,
    time: Date.now()
  };

  socket.emit("message", msg);
  msgInput.value = "";
}

// Получение истории
socket.on("history", serverMessages => {
  messagesDiv.innerHTML = "";
  localMessages = serverMessages;
  localStorage.setItem("messages", JSON.stringify(localMessages));
  localMessages.forEach(addMessage);
});

// Получение новых сообщений
socket.on("message", msg => {
  localMessages.push(msg);
  localStorage.setItem("messages", JSON.stringify(localMessages));
  addMessage(msg);
});

function addMessage(msg) {
  const div = document.createElement("div");
  div.className = "message";

  div.innerHTML = `
    <div class="nick">${msg.user}</div>
    <div class="text">${msg.text}</div>
  `;

  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
