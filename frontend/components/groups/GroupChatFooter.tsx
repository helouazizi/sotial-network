import React from 'react'

const GroupChatFooter = () => {
    return (
        <div className='chat-grp-footer'>
            <textarea maxLength={3000} placeholder='Type a message...'></textarea>
            <button>send</button>
        </div>
    )
}

export default GroupChatFooter