const express = require('express');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const port = process.env.PORT || 3000;
const phpPath = '/opt/homebrew/bin/php';
const phpScript = path.join(__dirname, 'public', 'events.php');

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/events.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'events.json'));
});

app.post('/events.php', (req, res) => {
  const input = JSON.stringify(req.body);
  exec(`${phpPath} ${phpScript} POST '${input}'`, (error, stdout, stderr) => {
    if (error) {
      console.error(`PHP Execution Error: ${stderr || error.message}`);
      res.status(500).send('Server Error');
      return;
    }

    try {
      const json = JSON.parse(stdout);
      res.send(json);
    } catch (parseError) {
      console.error(`Invalid JSON Output: ${stdout}`);
      res.status(500).send('Invalid JSON Output from PHP');
    }
  });
});

app.delete('/events.php', (req, res) => {
  exec(`${phpPath} ${phpScript} DELETE`, (error, stdout, stderr) => {
    if (error) {
      console.error(`PHP Execution Error: ${stderr || error.message}`);
      res.status(500).send('Server Error');
      return;
    }
    res.send(stdout);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
