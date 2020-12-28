const express = require('express');
const app = express();

const port = process.env.PORT || 3000;
const http = require('http');
const server = http.createServer(app);

const path = require('path');

const fetch = require('node-fetch');

server.listen(port, () => console.log('Listening at ' + port));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '1mb' }));

// app.get('/getSongs/:TOKEN', async (req, res) => {

//   const TOKEN = req.params.TOKEN;
//   const API_URL = `http://127.0.0.1:5000/searchspotify/?TOKEN=${TOKEN}`;
//   const options = {
//     methods: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   };
//   const request = await fetch(API_URL, options);
//   const response = await request.json();
//   res.json(response);
// })