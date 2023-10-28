import '../style/AvatarSelectionForm.css'

function AvatarSelectionForm({setAvatarImage}) {
  function handleAvatars(imageSrc) {
    setAvatarImage(imageSrc)
    let avatars = document.querySelectorAll('#avatar-option')
    avatars.forEach((avatar) => {
      if(avatar.src.includes(imageSrc)) {
        avatar.className = 'avatar-choice-active'
      } else {
        avatar.className = 'avatar-choice'
      }
    })
  }
  return(
    <div>
      <div id="avatar-selection">
        <img id='avatar-option' className='avatar-choice' src='images/avatars/avatar1.jpg' onClick={ () =>
        {
          handleAvatars('images/avatars/avatar1.jpg')
        }
        }></img>
        <img id='avatar-option' className='avatar-choice' src='images/avatars/avatar2.jpg' onClick={ () => {
          handleAvatars('images/avatars/avatar2.jpg')
        }
        }></img>
        <img id='avatar-option' className='avatar-choice' src='images/avatars/avatar3.jpg' onClick={ () => {
          handleAvatars('images/avatars/avatar3.jpg')
        }
        }></img>
        <img id='avatar-option' className='avatar-choice' src='images/avatars/avatar4.jpg' onClick={ () => {
          handleAvatars('images/avatars/avatar4.jpg')
        }
        }></img>
        <img id='avatar-option' className='avatar-choice' src='images/avatars/avatar5.jpg' onClick={ () => {
          handleAvatars('images/avatars/avatar5.jpg')
        }
        }></img>
      </div>
      <p id='select-avatar-p'>Select your avatar (optional)</p>
    </div>
  )
}

export default AvatarSelectionForm