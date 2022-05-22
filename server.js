const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

console.log('greetings earthlings\nwe runnin shit...\n')

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const users = {}

io.on('connection', (socket) => {
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running on port ${port}`);
});
