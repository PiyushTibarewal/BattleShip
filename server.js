const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

const port = 4001

const app = express()

const server = http.createServer(app)

const io = socketIO(server)

io.on('connection', socket => {
  console.log('new client Connected')
  console.log(`Socket ${socket.id} connected`)
  //   const id = socket.id
  socket.on('submit', function (msg) {
    // once we get a 'change color' event from one of our clients, we will send it to the rest of the clients
    // we make use of the socket.emit method again with the argument given to use from the callback function above
    var name = msg.uname
    var pswd = msg.password
    console.log('print Changed to: ', name, pswd)
    io.sockets.emit('submit', { uname: name, password: pswd })
  })
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

server.listen(port, () => console.log(`Listening on port ${port}`))

