const express = require('express');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const port = process.env.PORT || 3000;

// Middleware для обробки JSON-запитів
app.use(express.json());

// Обслуговування статичних файлів
app.use(express.static(path.join(__dirname, 'public')));

// Обробка GET-запитів до events.php
app.get('/events.php', (req, res) => {
  exec('php public/events.php GET', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      res.status(500).send('Server Error');
      return;
    }
    res.send(stdout);
  });
});

// Обробка POST-запитів до events.php
app.post('/events.php', (req, res) => {
  const input = JSON.stringify(req.body);
  exec(`php public/events.php POST '${input}'`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      res.status(500).send('Server Error');
      return;
    }
    res.send(stdout);
  });
});

// Обробка DELETE-запитів до events.php
app.delete('/events.php', (req, res) => {
  exec('php public/events.php DELETE', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      res.status(500).send('Server Error');
      return;
    }
    res.send(stdout);
  });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
