import ScrollToBottom from "react-scroll-to-bottom"

function Messages({messages, nickname}) {
  return (
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
  )
}

export default Messages