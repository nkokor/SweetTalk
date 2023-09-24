import React from "react";
import { useState, useMemo } from "react";
import ScrollToBottom from "react-scroll-to-bottom"

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

  function handleChatInfo() {
    let chatInfo = document.getElementById("chat-info-div")
    if(chatInfo.className === "chat-info-closed") {
      chatInfo.className = "chat-info-opened"
    } else {
      chatInfo.className = "chat-info-closed"
    }

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

  useMemo(() => {
    socket.on("receive_message", (data) => {
      setMessages((list) => [...list, data])
    })
  }, [socket])

  return (
     <div id="chat-window">
      <div id="chat-window-header">
        <p>Chatroom {room}</p>
        <div id='icon-div'>
          <img id='room-info-icon' src='images/icons8-three-dots-30.png' onClick={ () => { handleChatInfo() }}></img>
        </div>
      </div>
      <div id='chat-info-div' className='chat-info-closed' >
          <div id='leave-button'>
            <img src='images/icons8-logout-48 (1).png'></img>
            <p>Leave chat</p>
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