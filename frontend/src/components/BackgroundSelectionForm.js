import '../style/BackgroundSelectionForm.css'

function BackgroundSelectionForm() {
  function changeChatBackground(image) {
    let chatBody = document.getElementById('chat-body')
    chatBody.style.backgroundImage = `url(${image})`
  }
  return (
    <div>
      <hr></hr>
      <p id='participants-title'>Chat background</p>
      <hr></hr>
      <div id="bg-selection">
          <img className='bg-choice' src='images/chat-backgrounds/bg1.jpg' onClick={ () =>
          {
            changeChatBackground('images/chat-backgrounds/bg1.jpg')
          }
          }></img>
          <img className='bg-choice' src='images/chat-backgrounds/bg2.jpg' onClick={ () => {
            changeChatBackground('images/chat-backgrounds/bg2.jpg')
          }
          }></img>
      </div>
    </div>
  )
}

export default BackgroundSelectionForm