import { SocketContext } from '@/context/socketContext'
import React, { useContext, useRef } from 'react'
import Popup from '../Popup'
import { PopupContext } from '@/context/PopupContext'

const GroupChatFooter = (props: { idGrp: number | undefined, members: string[] | undefined }) => {
    const { ws } = useContext(SocketContext) ?? {}
    const textarea = useRef<HTMLTextAreaElement>(null)
    const popup = useContext(PopupContext)
    const handleSendMessageGroup = () => {

        let message = textarea.current?.value.trim()
        if (!message) {
            popup?.showPopup("faild", "You can send empty message!")
            return
        }
        const inTArray = props.members?.map(Number)
        console.log("=>>>",message);
        console.log("État de la socket :", ws?.current?.readyState);
        ws?.current?.send(JSON.stringify({
            id: props.idGrp,
            message: message,
            members: inTArray,
            type: "messageGroup"
        }))
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
            <button onClick={handleSendMessageGroup}>send</button>
        </div>
    )
}

export default GroupChatFooter