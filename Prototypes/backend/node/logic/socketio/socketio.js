module.exports = (server) => {

  // import the socketio package
  const socket = require('socket.io');

  // set an io instance, with cors origin allowed
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
}
