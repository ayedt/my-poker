const express = require('express');
const app = express();
const http = require('http').createServer(app);
const WebSocket = require('ws');

const wss = new WebSocket.Server({ server: http });

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

let clients = [];

wss.on('connection', (ws) => {
  clients.push(ws);

  ws.on('message', (message) => {
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    clients = clients.filter(c => c !== ws);
  });
});

http.listen(PORT, () => console.log(`Server running on port ${PORT}`));