const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(__dirname));

let sender = null;
let receiver = null;

wss.on("connection", ws => {

    ws.on("message", msg => {
        // первый пакет — роль
        if (msg.toString() === "sender") {
            sender = ws;
            return;
        }
        if (msg.toString() === "receiver") {
            receiver = ws;
            return;
        }

        // передаём данные
        if (ws === sender && receiver) {
            receiver.send(msg);
        }
    });

    ws.on("close", () => {
        if (ws === sender) sender = null;
        if (ws === receiver) receiver = null;
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log("Server running");
});
