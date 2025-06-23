import React from 'react'
import { MdOutlineLaptopWindows } from 'react-icons/md';
import { CiChat2 } from 'react-icons/ci';
import { LiaNewspaperSolid } from 'react-icons/lia';
const Welcomingmessage = () => {
  return (
          <section id='user-welcoming'>
        <div className="logo">
          Social <span>Net</span>work
        </div>
        <div className='user-community'>
          <div className='user-community-logo'>
            <MdOutlineLaptopWindows />
          </div>
          <div className='user-community-content'>
            <h1 className='user-community-title'> Community</h1>
            <p className='user-community-p'> Where connections grow and communities thrive.</p>
          </div>
        </div>
        <div className='user-chat'>
          <div className='user-chat-logo'>
            <CiChat2 />
          </div>
          <div className='user-chat-content'>
            <h1 className='user-chat-title'> Chat</h1>
            <p className='user-chat-p'>Conversations that bring people closer—instantly.</p>

          </div>
        </div>
        <div className='user-name'>
          <div className='user-name-logo'>
            <LiaNewspaperSolid />
          </div>
          <div className='user-name-content'>
            <h1 className='user-name-title'> News</h1>
            <p className='user-name-p'>Share moments. Stay informed. Be heard.</p>
          </div>

        </div>

      </section>

  )
}

export default Welcomingmessage 

    