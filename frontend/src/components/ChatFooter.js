import { useState } from "react";

function ChatFooter({socket, data, setMessages}) {
  const [newMessage, setNewMessage] = useState("")
  const sendMessage = async () => {
    if(newMessage !== "") {
      const messageTime = new Date(Date.now())
      const messageData = {
        room: data.room,
        avatar: data.avatar,
        author: data.nickname,
        time: messageTime.getHours() + ":" + messageTime.getMinutes(),
        message: newMessage
      }
      await socket.emit("send_message", messageData)
      document.getElementById('message-input').value=""
      setNewMessage("")
      setMessages((list) => [...list, messageData])
    }
  }
  return (
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
  )
}

export default ChatFooter