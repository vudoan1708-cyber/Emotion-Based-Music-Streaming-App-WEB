require('dotenv').config();

const cors = require('cors');

const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser')
const fallback = require('express-history-api-fallback');

const compression = require('compression');

// components
const callbackRouter = require('./routes/callback');
const loginRouter = require('./routes/login');
// const refreshRouter = require('./routes/refresh');
const spotifyRouter = require('./routes/spotify');

const root = path.join(__dirname, '../dist');
const port = process.env.PORT || 5000;

const app = express();
const http = require('http');
const server = http.createServer(app);

// listening to any dynamic port number
server.listen(port, () => console.log('Listening on port ' + port));

// cookie parser for authenticating correct redirecting
app.use(cookieParser());
app.use(compression());

app.use(cors());

// routes
loginRouter(app);
callbackRouter(app);
// refreshRouter(app);
spotifyRouter(app);


// socketio
const socket = require('socket.io');
const io = socket(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"]
  }
});

// to emit old data to new connections
let history = [],

// to keep track of new connections
    clients = [];

// listen to a new connection
io.sockets.on('connection', (socket) => {
  console.log('new connection ' + socket.id);

  // append every new connection to clients array
  clients.push({id : socket.client.id})

  // check if it is in the array (validation to securely emit data to appropriate client)
  let getClientID = clients.find(e => (e.id === socket.client.id))

  if (getClientID)

      // emit historical data to every newly connected client 
      // after a click event is triggered
      socket.emit('click', history);
      
  // receives a message on click event
  socket.on('click', (data) => {
      
      // append data to the history variable
      history.push(data);

      // send the message back out to all clients except one that's connecting
      socket.broadcast.emit('click', data);
  });
});

// check if the app is running in production
if (process.env.NODE_ENV === 'production') {

  // use the static files
  app.use(express.static(root));

// otherwise
} else {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
}

// fallback
app.use(fallback('index.html', { root }));
