import './App.css'
import './style/Chat.css';
import './style/LoginForm.css'

import { useState } from 'react'

import Chat from './components/Chat';

import io from 'socket.io-client'

import { useGlobal } from './GlobalContext';

const socket = io.connect("http://localhost:3001")

function App() {

  const [avatar, setAvatar] = useState("images/no-avatar.jpg")
  const [nickname, setNickname] = useState("")
  const [room, setRoom] = useState("")
  const { globalVariable: showChat, setGlobalVariable: setShowChat } = useGlobal();

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

  function handleAvatars(imageSrc) {
    setAvatar(imageSrc)
    let avatars = document.querySelectorAll('img')
    avatars.forEach((avatar) => {
      avatar.className = 'avatar-choice'
    })
    avatars.forEach((avatar) => {
      if(avatar.src.includes(imageSrc)) {
        avatar.className = 'avatar-choice-active'
      }
    })
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
              handleAvatars('images/avatar1.jpg')
            }
            }></img>
            <img className='avatar-choice' src='images/avatar2.jpg' onClick={ () => {
              handleAvatars('images/avatar2.jpg')
            }
            }></img>
            <img className='avatar-choice' src='images/avatar3.jpg' onClick={ () => {
              handleAvatars('images/avatar3.jpg')
            }
            }></img>
            <img className='avatar-choice' src='images/avatar4.jpg' onClick={ () => {
              handleAvatars('images/avatar4.jpg')
            }
            }></img>
            <img className='avatar-choice' src='images/avatar5.jpg' onClick={ () => {
              handleAvatars('images/avatar5.jpg')
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
