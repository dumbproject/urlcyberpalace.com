// i did not get this script to work yet
var socket = io()

var messages = document.getElementById('messages')
var form = document.getElementById('form')
var input = document.getElementById('input')

const name = prompt('What is your name?')
appendMessage(`You joined as user ${name}`)
socket.emit('new-user', name)

// function inputFocus() {
//     document.getElementById("input").focus()
// }

form.addEventListener('submit', function(e) {
  e.preventDefault()
  if (input.value) {
    socket.emit('chat message', input.value)
    input.value = ''
  }
})

socket.on('chat message', function(msg) {
  var item = document.createElement('li')
  item.textContent = msg
  messages.appendChild(item)
  window.scrollTo(0, document.body.scrollHeight)
})

function appendMessage(message) {
  const messageElement = document.createElement('li')
  messageElement.innerText = message
  messages.append(messageElement)
}
