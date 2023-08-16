const express = require('express')
const app = express()
const http = require('http')
const { Server } = require('socket.io')

const cors = require('cors')
app.use(cors()) // allow cross origin requests from any domain, for testing purposes only!

const server = http.createServer()

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["POST", "GET"]
  }
})

io.on("connection", (socket) => {
  console.log(`user ${socket.id} connected to the server`)
  socket.on("join_chat", (data) => {
    socket.join(data.room)
    console.log(`User ${socket.id} has joined chatroom ${data.room}`)
    const notification = {
      room: data.room,
      author: null,
      time: null,
      message: `${data.username} joined the chat`
    }
    socket.to(data.room).emit("receive_message", notification)
  })

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data)
    console.log(`User ${socket.id} has sent a message`)
  })

  socket.on("disconnect", () => {
    console.log(`user ${socket.id} disconnected from the server`)
  })
})

server.listen(3001, () => {
  console.log('server is running on port 3001')
})