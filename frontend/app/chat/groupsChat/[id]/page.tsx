"use client"
import GroupChatBody from '@/components/groups/GroupChatBody'
import GroupChatFooter from '@/components/groups/GroupChatFooter'
import GroupChatHeader from '@/components/groups/GroupChatHeader'
import { GroupsContext } from '@/context/GroupsContext'
import { GetInfoGrp } from '@/services/groupServices'
import { Group } from '@/types/groups'
import { useParams } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'

const page = () => {
    const { id } = useParams()
    const [chatInfo, setChatInfo] = useState<Group | null>(null)
    const grpCtxt = useContext(GroupsContext)
    useEffect(() => {
        const fetcher = async () => {
            const data = await GetInfoGrp(id)
            grpCtxt?.setCurrentGrp(data)

        }
        fetcher()
    }, [id])

  

    return (
        <>
            <GroupChatHeader  />
            <GroupChatBody />
            <GroupChatFooter idGrp={chatInfo?.id} members={chatInfo?.members} />
        </>
    )
}

export default page