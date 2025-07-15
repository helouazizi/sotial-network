import { GroupsContext } from '@/context/GroupsContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useContext } from 'react'
import { HiUserGroup } from 'react-icons/hi'
import { MdGroups } from 'react-icons/md'

const GroupChatHeader = () => {
    let pathName = usePathname()
    const grpCtxt = useContext(GroupsContext)
    let data = grpCtxt?.currentGrp
    let title = data?.title && data?.title.length > 25 ? data?.title.slice(0, 25).trim() + "..." : data?.title
    let path = pathName.startsWith("/chat/groupsChat") ? "/groups/joined/" + data?.id + "/posts" : ""

    return (
        <div className='chat-grp-header'>
            <Link href={path}><span><MdGroups /></span> <p>{title}</p></Link>
            <div className='members'><span>{data?.count_members}</span> <HiUserGroup /> </div>
        </div>
    )
}

export default GroupChatHeader
