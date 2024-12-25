const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();


app.use(bodyParser.json());
app.use(express.static('public')); 

app.post('/save-event', (req, res) => {
    const { event, localTime } = req.body;
    const serverTime = new Date().toISOString();

    const logEntry = {
        event,
        localTime,
        serverTime
    };

    fs.appendFileSync('events.log', JSON.stringify(logEntry) + '\n');
    res.json({ status: 'success', serverTime });
});


app.get('/events', (req, res) => {
    const data = fs.readFileSync('events.log', 'utf-8').trim().split('\n').map(line => JSON.parse(line));
    res.json(data);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
