const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = process.env.PORT || 3000
var os = require('os');

console.log('\n\ngreetings earthlings\nwe runnin shit......\n\n')

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
  console.log('### a new user connected to the site')
})

const users = {}

var now = new Date()
  , hours = ('0' + now.getHours()).slice(-2)
  , minutes = ('0' + now.getMinutes()).slice(-2)
  , seconds = ('0' + now.getSeconds()).slice(-2)
  , time = [hours, minutes, seconds].join(':')



io.on('connection', (socket) => {
  var clientIp = socket.request.connection.remoteAddress
  console.log(clientIp)
  // console.log(os.type())
  // console.log(os.release())
  // console.log(os.platform())

  socket.on('new-user', name => {
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)
    console.log('### user connected:', name, '\n### socket.id:', socket.id)
  })

  socket.on('chat message', message => {
    io.emit('chat message', time + ' ' + users[socket.id] + ': ' + message)
    // socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
    console.log(time + ' ' + users[socket.id] + ': ' + message)
  })

  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    console.log('### user disconnected:', users[socket.id])
    delete users[socket.id]
  })
})

http.listen(port, () => {
  console.log(`Socket.IO server running on port ${port}`)
})
