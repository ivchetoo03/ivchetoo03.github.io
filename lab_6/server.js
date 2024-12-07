const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API для отримання меню
app.get('/api/menu', (req, res) => {
    fs.readFile('menu.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send('Помилка читання меню!');
        res.json(JSON.parse(data));
    });
});

// API для збереження меню
app.post('/api/menu', (req, res) => {
    const menuData = req.body;
    fs.writeFile('menu.json', JSON.stringify(menuData, null, 2), 'utf8', (err) => {
        if (err) return res.status(500).send('Помилка збереження меню!');
        res.send('Меню збережено!');
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер працює на http://localhost:${PORT}`);
});
