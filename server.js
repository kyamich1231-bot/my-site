const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

let senderSocket = null;
let receiverSocket = null;

io.on("connection", (socket) => {
    console.log("New connection");

    // Получаем роль
    socket.on("role", role => {
        if (role === "sender") senderSocket = socket;
        if (role === "receiver") receiverSocket = socket;
    });

    // Получаем данные от отправителя и шлём получателю
    socket.on("file-info", data => {
        if (receiverSocket) receiverSocket.emit("file-info", data);
    });

    socket.on("file-chunk", chunk => {
        if (receiverSocket) receiverSocket.emit("file-chunk", chunk);
    });

    socket.on("file-end", () => {
        if (receiverSocket) receiverSocket.emit("file-end");
    });

    socket.on("disconnect", () => {
        if (socket === senderSocket) senderSocket = null;
        if (socket === receiverSocket) receiverSocket = null;
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Server running on port " + PORT));
