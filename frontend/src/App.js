import './App.css'
import './style/Chat.css';
import './style/LoginForm.css'
import { useState } from 'react'

import Chat from './components/Chat';


import io from 'socket.io-client'

const socket = io.connect("http://localhost:3001")

function App() {

  const [avatar, setAvatar] = useState("images/no-avatar.jpg")
  const [nickname, setNickname] = useState("")
  const [room, setRoom] = useState("")
  const [showChat, setShowChat] = useState(false)

  const joinChat = () => {
    if(nickname === "" || room === "") {
      alert('Please input valid data')
    } else {
        const data = {
          room: room,
          avatar: avatar,
          username: nickname
        }
        socket.emit("join_chat", data)
        setShowChat(true)
    }
  }

  return (
    <div className="App">
      {showChat ? ( 
       <Chat socket={socket} avatar={avatar} nickname={nickname} room={room}></Chat>
      ) : (
        <div className="login-div">
          <p id='join-message'>Let's join a chat room!</p>
          <div id="avatar-selection">
            <img className='avatar-choice' src='images/avatar1.jpg' onClick={ () =>
            {
              setAvatar('images/avatar1.jpg')
            }
            }></img>
            <img className='avatar-choice' src='images/avatar2.jpg' onClick={ () => {
              setAvatar('images/avatar2.jpg')
            }
            }></img>
            <img className='avatar-choice' src='images/avatar3.jpg' onClick={ () => {
              setAvatar('images/avatar3.jpg')
            }
            }></img>
            <img className='avatar-choice' src='images/avatar4.jpg' onClick={ () => {
              setAvatar('images/avatar4.jpg')
            }
            }></img>
            <img className='avatar-choice' src='images/avatar5.jpg' onClick={ () => {
              setAvatar('images/avatar5.jpg')
            }
            }></img>
          </div>
          <p id='select-avatar-p'>Select your avatar (optional)</p>
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
