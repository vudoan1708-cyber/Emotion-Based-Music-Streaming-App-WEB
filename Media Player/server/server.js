const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const http = require('http');
const server = http.createServer(app);

const path = require('path');

// dotenv
require('dotenv').config();

server.listen(port, () => { console.log('listening at port ' + port) });

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json({ limit: '1mb' }));

app.get(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST");
    res.header("Access-Control-Allow-Headers", "Origin, Accept, X-Requested-With, Content-Type, Accept-Language");
    // res.header("Accept-Language", "*");
    next()
});

// get api key
app.get('/api/', (req, res) => {

    // get api key from dotenv
    const API_KEY = process.env.API_KEY;

    // create a response to the client side
    res.json(API_KEY);
});

// get random character
app.get('/random/', (req, res) => {

    // grasp the headers
    const headers = req.headers;

    // const FETCH_URL = 
})