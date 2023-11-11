import { useState, useMemo } from "react";

function Participants({socket, user}) {

  const [participants, setParticipants] = useState([
    {
      name: user.nickname,
      avatar: user.avatar
    }
  ])

  useMemo(() => {
    socket.on("participants", (data) => {
      setParticipants(data)
    })
  }, [socket])

  return (
    <div>
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
    </div>
  )
}

export default Participants