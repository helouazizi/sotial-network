"use client"
import GroupChatBody from '@/components/groups/GroupChatBody'
import GroupChatFooter from '@/components/groups/GroupChatFooter'
import GroupChatHeader from '@/components/groups/GroupChatHeader'
import { SocketContext } from '@/context/socketContext'
import { useParams } from 'next/navigation'
import React, { useContext, useEffect } from 'react'

const page = () => {
    const { ws } = useContext(SocketContext) ?? {}

    const { id } = useParams()

    useEffect(() => {
        if (ws?.current) {
            ws.current.send(JSON.stringify({
                group_id: Number(id),
                type: "groupChatInfo"
            }))
        }
    }, [ws?.current?.readyState, id])

    return (
        <>
            <GroupChatHeader />
            <GroupChatBody />
            <GroupChatFooter />
        </>
    )
}

export default page