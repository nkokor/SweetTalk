import React from "react";
import { useState, useMemo } from "react";
import ScrollToBottom from "react-scroll-to-bottom"

import { useGlobal } from "../GlobalContext";
import BackgroundSelectionForm from "./BackgroundSelectionForm";

function Chat( {socket, avatar, nickname, room} ) {
  const [newMessage, setNewMessage] = useState("")
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
      avatar: avatar,
      nickname: nickname + ' (You)'
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

  function handleParticipants(data) {
    let newParticipants = []
    participants.forEach((participant) => {
      if(participant.nickname != data.nickname) {
        newParticipants.push(participant)
      }
    })
    setParticipants(newParticipants)
  }

  const sendMessage = async () => {
    if(newMessage !== "") {
      const messageTime = new Date(Date.now())
      const data = {
        room: room,
        avatar: avatar,
        author: nickname,
        time: messageTime.getHours() + ":" + messageTime.getMinutes(),
        message: newMessage
      }
      await socket.emit("send_message", data)
      document.getElementById('message-input').value=""
      setNewMessage("")
      setMessages((list) => [...list, data])
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
    socket.on("user_join", (data) => {
      setParticipants((list) => [...list, data])
    })
  }, [socket])

  useMemo( () => {
    socket.on("user_left", (data) => {
      console.log(participants)
      handleParticipants(data)
    })
  })

  return (
     <div id="chat-window">
      <div id="chat-window-header">
        <p>Chatroom {room}</p>
        <div id='icon-div'>
          <img id='room-info-icon' src='images/icons/icons8-three-dots-30.png' onClick={ () => { handleChatInfo() } }></img>
        </div>
      </div>
      <div id='chat-info-div' className='chat-info-closed' >
        <p id='participants-title'>Participants</p>
        <hr></hr>
        <div id='participants'>
          {
            participants.map((participant) => {
              return (
                <div className="participant-div">
                  <img className="participant-image" src={participant.avatar}></img>
                  <p className="participant-nickname">{participant.nickname}</p>
                </div>
              )
            })
          }
        </div>
        <BackgroundSelectionForm/>
        <div id='button-div'>
          <hr></hr>
          <div id='leave-button'>
            <img src='images/icons/icons8-logout-48 (1).png' onClick={ leaveChat }></img>
            <p onClick={ leaveChat }>Leave chat</p>
          </div>
        </div>
      </div>
      <div id="chat-body">
        <ScrollToBottom id="message-container">{ 
          messages.map((messageData) => {
            let isReceived = true
            let messageID
            let avatarDivClass
            let avatarImageClass
            if(messageData.author === null) {
              messageID = "join-notification"
              avatarDivClass = "no-avatar"
              avatarImageClass = "no-avatar"
            } else if(messageData.author === nickname) {
              isReceived = false
              messageID = "sent"
              avatarDivClass = "avatar-img-div"
              avatarImageClass = "avatar-img"
            } else {
              messageID = "received"
              avatarDivClass = "avatar-img-div"
              avatarImageClass = "avatar-img"
            }
            if (isReceived) {
              return (
              <div className="message" id={ messageID }>
                  <div className={ avatarDivClass }>
                    <img className={ avatarImageClass } src={messageData.avatar}></img>
                  </div>
                  <div className="message-div">
                    <div className="message-author-info">
                      <p className="message-author">{ messageData.author }</p>
                    </div>
                    <div className="text-time-div">
                      <div className="message-content">
                        <p className="message-text">{ messageData.message }</p>
                      </div>
                      <div className='message-time-info'>
                        <p className="message-time">{ messageData.time }</p>
                      </div>
                    </div>
                  </div>
              </div>
            ) 
          } else {
            return (
              <div className="message" id={ messageID }>
                  <div className="message-div">
                    <div className="message-author-info">
                      <p className="message-author">{ messageData.author }</p>
                    </div>
                    <div className="text-time-div">
                      <div className="message-content">
                        <p className="message-text">{ messageData.message }</p>
                      </div>
                      <div className='message-time-info'>
                        <p className="message-time">{ messageData.time }</p>
                      </div>
                    </div>
                  </div>
                  <div className={ avatarDivClass }>
                    <img className={ avatarImageClass } src={messageData.avatar}></img>
                  </div>
              </div>
            ) 
          }
          }) 
        }</ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input 
          type="text" 
          placeholder="Message..." 
          id="message-input"
          onChange={ 
            (event) => {
            setNewMessage(event.target.value)
          }
          }
          onKeyDown={
            (event) => {
              if(event.key === "Enter") {
                sendMessage()
              }
            }
          }
          ></input>
        <button onClick={ sendMessage } id='send-message-button'>&#9658;</button>
      </div>
    </div>  
  )
}

export default Chat