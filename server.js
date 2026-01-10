import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Раздаём файлы из корня
app.use(express.static("./"));

let messages = []; // временное хранение на сервере

io.on("connection", socket => {
  console.log("Пользователь подключился");

  // Отправляем историю новому клиенту
  socket.emit("history", messages);

  socket.on("message", data => {
    messages.push(data);

    // Ограничим историю (чтобы не росла бесконечно)
    if (messages.length > 100) messages.shift();

    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("Пользователь вышел");
  });
});

server.listen(PORT, () => {
  console.log("Сервер запущен на порту:", PORT);
});
