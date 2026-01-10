import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static("./"));

let messages = [];
let users = {};

io.on("connection", socket => {
  socket.emit("history", messages);
  io.emit("users", Object.values(users));

  socket.on("join", username => {
    users[socket.id] = username;
    io.emit("users", Object.values(users));
  });

  socket.on("message", data => {
    messages.push(data);
    if (messages.length > 200) messages.shift();
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("users", Object.values(users));
  });
});

server.listen(PORT, () => {
  console.log("Server running:", PORT);
});
