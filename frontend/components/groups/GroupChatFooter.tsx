import { SocketContext } from '@/context/socketContext'
import React, { useContext, useRef } from 'react'
import { PopupContext } from '@/context/PopupContext'
import { GroupsContext } from '@/context/GroupsContext'

const GroupChatFooter = (props: { idGrp: number | undefined, members: string[] | undefined }) => {
    const { ws, user } = useContext(SocketContext) ?? {}
    const textarea = useRef<HTMLTextAreaElement>(null)
    const popup = useContext(PopupContext)
    const grpCtxt = useContext(GroupsContext)
    let data = grpCtxt?.currentGrp;


    const handleSendMessageGroup = () => {
        let message = textarea.current?.value.trim()
        if (!message) {
            popup?.showPopup("faild", "You can send empty message!")
            return
        }
        const inTArray = data?.members?.map(Number)
        ws?.current?.send(JSON.stringify({
            id: data?.id,
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
            <button onClick={handleSendMessageGroup}>send</button>
        </div>
    )
}

export default GroupChatFooter