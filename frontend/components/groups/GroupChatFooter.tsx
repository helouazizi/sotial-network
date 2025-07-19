import { SocketContext } from '@/context/socketContext'
import React, { useContext, useRef } from 'react'
import { PopupContext } from '@/context/PopupContext'
import EmojiList from '../chat/emojiList'


const GroupChatFooter = () => {
    const { ws, user, currentGrp } = useContext(SocketContext) ?? {}
    const textarea = useRef<HTMLTextAreaElement>(null)
    const popup = useContext(PopupContext)

    const handleSendMessageGroup = () => {
        let message = textarea.current?.value.trim()
        if (!message) {
            popup?.showPopup("faild", "You can send empty message!")
            return
        }
        const inTArray = currentGrp?.members?.map(Number)
        ws?.current?.send(JSON.stringify({
            id: currentGrp?.id,
            action:  currentGrp?.title.slice(0, 25).trim() + "...",
            message: message,
            members: inTArray,
            fullName: `${user?.firstname} ${user?.lastname}`,
            avatar: user?.avatar,
            type: "saveMessageGroup"
        }))
        if (textarea.current) {
            textarea.current.value = ""
        }
    }
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessageGroup()
        }
    }
    return (
        <div className='chat-grp-footer'>
            <textarea maxLength={3000} ref={textarea} onKeyDown={handleKeyDown} placeholder='Type a message...'></textarea>
            <EmojiList textarea={textarea.current} />
            <button onClick={handleSendMessageGroup}>send</button>
        </div>
    )
}

export default GroupChatFooter