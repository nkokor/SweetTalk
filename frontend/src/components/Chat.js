import React from "react";
import { useState, useMemo } from "react";
import { useGlobal } from "../GlobalContext";
import BackgroundSelectionForm from "./BackgroundSelectionForm";
import Messages from "./Messages";
import Participants from "./Participants";
import ChatFooter from "./ChatFooter";

function Chat( {socket, avatar, nickname, room} ) {
  const [messages, setMessages] = useState([
    {
      room: room,
      avatar: null,
      author: null,
      time: null,
      message: "You joined"
    }
  ])

  const [participants, setParticipants] = useState([
    {
      name: nickname,
      avatar: avatar
    }
  ])

  const { globalVariable: showChat, setGlobalVariable: setShowChat } = useGlobal();

  function handleChatInfo() {
    let chatInfo = document.getElementById("chat-info-div")
    if(chatInfo.className === "chat-info-closed") {
      chatInfo.className = "chat-info-opened"
    } else {
      chatInfo.className = "chat-info-closed"
    }
  }

  const leaveChat = async () => {
    const data = {
      room: room,
      avatar: avatar,
      nickname: nickname
    }
    await socket.emit("leave_chat", data)
    setShowChat(false)
  }

  useMemo(() => {
    socket.on("receive_message", (data) => {
      setMessages((list) => [...list, data])
    })
  }, [socket])

  useMemo(() => {
    socket.on("participants", (data) => {
      setParticipants(data)
    })
  }, [socket])


  return (
     <div id="chat-window">
      <div id="chat-window-header">
        <p>Chatroom {room}</p>
        <div id='icon-div'>
          <img id='room-info-icon' src='images/icons/icons8-three-dots-30.png' onClick={ () => { handleChatInfo() } }></img>
        </div>
      </div>
      <div id='chat-info-div' className='chat-info-closed' >
        <Participants participants={participants}/>
        <BackgroundSelectionForm/>
        <div id='button-div'>
          <hr></hr>
          <div id='leave-button'>
            <img src='images/icons/icons8-logout-48 (1).png' onClick={ leaveChat }></img>
            <p onClick={ leaveChat }>Leave chat</p>
          </div>
        </div>
      </div>
      <Messages messages={messages} nickname={nickname}/>
      <ChatFooter socket={socket} setMessages={setMessages} data={ {room: room, avatar: avatar, nickname: nickname} }/>
    </div>  
  )
}

export default Chat