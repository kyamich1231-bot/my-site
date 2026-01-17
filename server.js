const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = 3000;

// Хранилище файлов в памяти
let files = [];

// Отдаём index.html при заходе на /
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log('Новый пользователь подключился');

    // Отправляем все файлы новому пользователю
    socket.emit('allFiles', files);

    // Когда клиент загружает файл
    socket.on('uploadFile', (file) => {
        files.push(file);
        io.emit('newFile', file); // всем клиентам
    });

    socket.on('disconnect', () => {
        console.log('Пользователь отключился');
    });
});

server.listen(PORT, () => {
    console.log(`Сервер работает на http://localhost:${PORT}`);
});
