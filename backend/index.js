const express = require('express')
const app = express()
const http = require('http')
const { Server } = require('socket.io')

const cors = require('cors')
const chatrooms = require('./data/chatrooms')
app.use(cors()) 

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

    // create new or find existing room
    let roomsExists = false
    let room = null
    for(let i = 0; i < chatrooms.length; i++) {
      if(chatrooms[i].id == data.room) {
        roomsExists = true
        room = chatrooms[i]
        break
      }
    }
    //if chatroom with given id does not exist create new chatroom
    if(room == null) {
      room = {id: data.room, participants: [{nickname: data.username, avatar: data.avatar}]}
      chatrooms.push(room)
    } 
    //if chatroom already exists add new user
    else {
      room.participants.push({nickname: data.username, avatar: data.avatar})
      for(let i = 0; i < chatrooms.length; i++) {
        if(chatrooms[i].id == room.id) {
          chatrooms[i] = room
          break
        }
      }
    }

    //create a notification that user joined
    const notification = {
      room: data.room,
      avatar: null,
      author: null,
      time: null,
      message: `${data.username} joined`,
    }

    //send notification that user joined to chatroom users
    socket.to(data.room).emit("receive_message", notification)
    //update chatroom participants
    socket.to(data.room).emit("participants", room.participants)
  })
           
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data)
    console.log(`User ${socket.id} has sent a message`)
  })

  socket.on("leave_chat", (data) => {
    //create notification that user leaving
    const notification = {
      room: data.room,
      avatar: null,
      author: null,
      time: null,
      message: `${data.nickname} left`,
    }

    //finding the room the user is leaving
    let lastUser = false
    let room = null
    for(let i = 0; i < chatrooms.length; i++) {
      if(chatrooms[i].id == data.room) {
        room = chatrooms[i]
        for(let j = 0; j < chatrooms[i].participants.length; j++) {
          if(chatrooms[i].participants[j].nickname === data.nickname) {
            //removing user from room participants
            chatrooms[i].participants.splice(j,1);
            break
          }
        }
        //deleting the room if the user was the last participant
        if(chatrooms[i].participants.length == 0) {
          lastUser = true
          chatrooms.splice(i, 1)
          break
        }
      }
    }
    //send notification that user left to other participants
    socket.to(data.room).emit("receive_message", notification)
    //update chatroom participants
    if(!lastUser) {
      if(room != null) {
        socket.to(data.room).emit("participants", room.participants)
      }
    }
  })

  socket.on("disconnect", () => {
    console.log(`user ${socket.id} disconnected from the server`)
  })
})


server.listen(3001, () => {
  console.log('server is running on port 3001')
})