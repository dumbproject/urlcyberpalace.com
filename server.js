const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

console.log('greetings earthlings\nwe runnin shit...\n')

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
  console.log('user connected to site')
});

const users = {}

io.on('connection', (socket) => {
  socket.on('new-user', name => {
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)
    console.log('### user connected:', name)
    console.log(socket.id)
  })

  socket.on('chat message', message => {
    io.emit('chat message', users[socket.id] + message);
    // socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
    console.log(message)
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    console.log('### user disconnected:', users[socket.id])
    delete users[socket.id]
  })
});

http.listen(port, () => {
  console.log(`Socket.IO server running on port ${port}`);
});
