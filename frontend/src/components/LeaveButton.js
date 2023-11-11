import { useGlobal } from "../GlobalContext";

function LeaveButton({socket, data}) {
  const { globalVariable: showChat, setGlobalVariable: setShowChat } = useGlobal();

  const leaveChat = async () => {
    await socket.emit("leave_chat", data)
    setShowChat(false)
  }
  return (
    <div id='button-div'>
      <hr></hr>
      <div id='leave-button'>
        <img src='images/icons/icons8-logout-48 (1).png' onClick={ leaveChat }></img>
        <p onClick={ leaveChat }>Leave chat</p>
      </div>
    </div>
  )
}

export default LeaveButton