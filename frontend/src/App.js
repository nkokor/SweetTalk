import './App.css'
import './style/Chat.css';
import './style/LoginForm.css'
import { useState } from 'react'
import Chat from './components/Chat';
import io from 'socket.io-client'
import { useGlobal } from './GlobalContext';
import AvatarSelectionForm from './components/AvatarSelectionForm';

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

  return (
    <div className="App">
      {showChat ? ( 
          <Chat socket={socket} avatar={avatar} nickname={nickname} room={room}></Chat>
      ) : (
        <div className="login-div">
          <img id='logo' src='logo.png' alt='LOGO'></img>
          <p id='join-message'>Let's join a chat room!</p>
          <AvatarSelectionForm setAvatarImage={setAvatar}/>
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
