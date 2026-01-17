const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path'); // важно для путей
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = 3000;

// Хранилище файлов в памяти
let files = [];

// Раздаем index.html и все файлы из корня проекта
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Для socket.io
io.on('connection', (socket) => {
    console.log('Новый пользователь подключился');

    // Отправляем все файлы при подключении
    socket.emit('allFiles', files);

    // Когда клиент загружает файл
    socket.on('uploadFile', (file) => {
        files.push(file); // {name, type, data}
        io.emit('newFile', file); // рассылаем всем
    });

    socket.on('disconnect', () => {
        console.log('Пользователь отключился');
    });
});

server.listen(PORT, () => {
    console.log(`Сервер работает на http://localhost:${PORT}`);
});
