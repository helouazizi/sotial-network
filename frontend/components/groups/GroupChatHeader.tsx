import { GroupsContext } from '@/context/GroupsContext'
import { SocketContext } from '@/context/socketContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useContext } from 'react'
import { HiUserGroup } from 'react-icons/hi'
import { MdGroups } from 'react-icons/md'

const GroupChatHeader = () => {
    const { currentGrp } = useContext(SocketContext) ?? {}
    let pathName = usePathname()
    let title = currentGrp?.title && currentGrp?.title.length > 25 ? currentGrp?.title.slice(0, 25).trim() + "..." : currentGrp?.title
    let path = pathName.startsWith("/chat/groupsChat") ? "/groups/joined/" + currentGrp?.id + "/posts" : ""

    return (
        <div className='chat-grp-header'>
            <Link href={path}><span><MdGroups /></span> <p>{title}</p></Link>
            <div className='members'><span>{currentGrp?.count_members}</span> <HiUserGroup /> </div>
        </div>
    )
}

export default GroupChatHeader
