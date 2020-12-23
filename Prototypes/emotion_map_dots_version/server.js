const express = require('express');
const app = express();

const port = process.env.PORT || 3000;
const http = require('http');
const server = http.createServer(app);

const path = require('path');

server.listen(port, () => console.log('Listening at ' + port));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '1mb' }));
