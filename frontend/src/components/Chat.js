import React from "react";
import { useState, useMemo } from "react";
import ScrollToBottom from "react-scroll-to-bottom"

function Chat( {socket, nickname, room} ) {
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      room: room,
      author: null,
      time: null,
      message: "You joined"
    }
  ])

  const sendMessage = async () => {
    if(newMessage !== "") {
      const messageTime = new Date(Date.now())
      const data = {
        room: room,
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
      </div>
      <div id="chat-body">
        <ScrollToBottom id="message-container">{ 
          messages.map((messageData) => {
            let messageID
            if(messageData.author === null) {
              messageID = "join-notification"
            } else if(messageData.author === nickname) {
              messageID = "sent"
            } else {
              messageID = "received"
            }
            return (
              <div className="message" id={ messageID }>
                  <div className="message-author-info">
                    <p className="message-author">{ messageData.author }</p>
                  </div>
                  <div className="message-content">
                    <p className="message-text">{ messageData.message }</p>
                  </div>
                  <div className='message-time-info'>
                    <p className="message-time">{ messageData.time }</p>
                  </div>
              </div>
            )
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