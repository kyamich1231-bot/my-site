const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = 3000;

// Хранилище файлов в памяти (для демо)
let files = [];

// Раздаем статику
app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
    console.log('Новый пользователь подключился');

    // Отправляем сразу все файлы при подключении
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
