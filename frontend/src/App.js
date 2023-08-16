import './App.css'
import './style/Chat.css';
import './style/LoginForm.css'
import { useState } from 'react'

import Chat from './components/Chat';


import io from 'socket.io-client'

const socket = io.connect("http://localhost:3001")

function App() {

  const [nickname, setNickname] = useState("")
  const [room, setRoom] = useState("")
  const [showChat, setShowChat] = useState(false)

  const joinChat = () => {
    if(nickname === "" || room === "") {
      alert('Please input valid data')
    } else {
        const data = {
          room: room,
          username: nickname
        }
        socket.emit("join_chat", data)
        setShowChat(true)
    }
  }

  return (
    <div className="App">
      {showChat ? ( 
       <Chat socket={socket} nickname={nickname} room={room}></Chat>
      ) : (
        <div className="login-div">
          <p id='join-message'>Let's join a chat room!</p>
          <input type='text' placeholder='Nickname...' onChange={ (event) => {
            setNickname(event.target.value)
          }}></input>
          <input type='text' placeholder='Chat room ID...' onChange={ (event) => {
            setRoom(event.target.value);
          }}></input>
          <button onClick={ joinChat } id='join-button'>Join</button>
      </div> 
      )
     }
    </div>
  );
}

export default App;
