const app = require('express')()
const port = process.env.PORT || 3000
const fs = require('fs')
const os = require('os')

const d = new Date()

const privateKey = fs.readFileSync('/etc/letsencrypt/live/urlcyberpalace.com/privkey.pem', 'utf8')
const certificate = fs.readFileSync('/etc/letsencrypt/live/urlcyberpalace.com/cert.pem', 'utf8')
const ca = fs.readFileSync('/etc/letsencrypt/live/urlcyberpalace.com/chain.pem', 'utf8')

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca
}

const http = require('http').createServer(app)
const https = require('https').createServer(credentials, app)
const io = require('socket.io')(https)

console.log('\n==> greetings earthlings <==\n==> ...we runnin shit... <==\n\n*** started server on ' + d + ' ***')

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
  console.log('\n>>> new user connected to site <<<\n>>> client ip: ', JSON.stringify(req.header('X-Forwarded-For')), ' <<<\n')
})
app.get('/home.html', (req, res) => {
  res.sendFile(__dirname + '/home.html')
  // console.log('### a new user connected to the site')
})

const users = {}
// this does nothing; server starts without users
// console.log('users:', users)

// const userList = document.getElementById('users')
// const getUsers = () => {
//   userList = users
// }


function currentTime() {
  var now = new Date()
  , hours = ('0' + now.getHours()).slice(-2)
  , minutes = ('0' + now.getMinutes()).slice(-2)
  , seconds = ('0' + now.getSeconds()).slice(-2)
  , time = [hours, minutes, seconds].join(':')
  return time
}


io.on('connection', (socket) => {
  // all of this doesn't work because i'm rerouting the https to http??
  // it's only telling me ip and os info about the server, not the client
  // var clientIp = socket.request.connection.remoteAddress
  // console.log('client ip: ', clientIp)
  // console.log(os.type())
  // console.log(os.release())
  // console.log(os.platform())

  socket.on('new-user', name => {
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)
    console.log('### user connected:', name, '(socket.id:', socket.id, ')\n### total users:', users)
  })

  socket.on('chat message', message => {
    io.emit('chat message', currentTime() + ' | ' + users[socket.id] + ': ' + message)
    // socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
    console.log(currentTime() + ' | ' + users[socket.id] + ': ' + message)
  })

  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    console.log('### user disconnected:', users[socket.id])
    delete users[socket.id]
  })
})

// http.listen(port, () => {
//   console.log(`server running on port ${port}`)
// })

https.listen(port, () => {
  console.log(`*** server running on port ${port} ***\n`)
})
