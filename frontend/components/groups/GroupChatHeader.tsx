import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { HiUserGroup } from 'react-icons/hi'
import { MdGroups } from 'react-icons/md'

const GroupChatHeader = (props: { idGrp: number | undefined, title: string | undefined, members: number | undefined }) => {
    let pathName = usePathname()
    let title = props.title && props.title.length > 25 ? props.title.slice(0, 25).trim() + "..." : props.title
    let path = pathName.startsWith("/chat/groupsChat") ? "/groups/joined/" + props.idGrp + "/posts" : ""
    
    return (
        <div className='chat-grp-header'>
            <Link href={path}><span><MdGroups /></span> <p>{title}</p></Link>
            <div className='members'><span>{props.members}</span> <HiUserGroup /> </div>
        </div>
    )
}

export default GroupChatHeader
