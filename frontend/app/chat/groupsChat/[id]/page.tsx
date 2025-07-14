"use client"
import GroupChatBody from '@/components/groups/GroupChatBody'
import GroupChatFooter from '@/components/groups/GroupChatFooter'
import GroupChatHeader from '@/components/groups/GroupChatHeader'
import { GetInfoGrp } from '@/services/groupServices'
import { Group } from '@/types/groups'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = () => {
    const { id } = useParams()
    const [chatInfo, setChatInfo] = useState<Group | null>(null)
    useEffect(() => {
        const fetcher = async () => {
            const data = await GetInfoGrp(id)
            setChatInfo(data)
        }
        fetcher()

    }, [id])

    return (
        <>
            <GroupChatHeader idGrp={chatInfo?.id} title={chatInfo?.title} members={chatInfo?.count_members} />
            <GroupChatBody />
            <GroupChatFooter idGrp={chatInfo?.id} members={chatInfo?.members} />
        </>
    )
}

export default page