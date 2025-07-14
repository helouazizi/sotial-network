"use client"

import { GetGroups, groupType } from '@/services/groupServices'
import Link from 'next/link';
import React, { useContext, useEffect } from 'react'
import { MdGroups } from "react-icons/md";
import SwitchButtons from './SwitchButtons';
import { GroupsContext } from '@/context/GroupsContext';
import { usePathname } from 'next/navigation';
import { PopupContext } from '@/context/PopupContext';
import { IoIosSend } from "react-icons/io";
import { SocketContext } from '@/context/socketContext';

function Groups() {
  const context = useContext(GroupsContext)
  const pathname = usePathname()
  const popup = useContext(PopupContext)
  const {ws} = useContext(SocketContext) ?? {}

  useEffect(() => {
    const fetchGroups = async () => {
      if ((pathname.startsWith("/groups/joined") && !context?.Groups) || pathname === "/groups/suggested") {
        let type: groupType = pathname.startsWith("/groups/joined") ? "getJoined" : "getSuggested"
        const data = await GetGroups(type)
        if (data && data.error) {
          popup?.showPopup("faild", "Ooops, something wrong!!")
          return
        }
        context?.setGroups(data)
      }
    }

    fetchGroups()
  }, [pathname])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ws) {
      ws.current?.send(JSON.stringify({
        "id": parseInt(e.currentTarget.id),
        "type": "joinGroupReq"
      }))
    }
  }
 
  const displayGroups = () => {
    let isSuggestedPath = pathname.startsWith("/groups/suggested")
    return context?.Groups?.map((group, index) => {
      let title = group.title.length > 25 ? group.title.slice(0, 25).trim() + "..." : group.title
      let path = pathname.startsWith("/groups/joined") ? "/groups/joined/" + group.id + "/posts" : ""

      return (
        <li key={index}>
          <Link href={path}><span><MdGroups /></span> <p>{title}</p></Link>
          {isSuggestedPath && (
            <div className="sugg-req">
              <button id={`${group.id}`} className='send' onClick={handleClick}> <IoIosSend /></button>
            </div>
          )}
        </li>
      )
    })
  }

  return (
    <>
      <SwitchButtons handleClick={(e) => {
        if (!pathname.startsWith(e.currentTarget.pathname)) context?.setGroups(null)
      }} firstButtonContent='joined' secondButtonContent='suggested' firstButtonLink='/groups/joined' secondButtonLink='/groups/suggested' />
      <ul className='joinedGroups'>
        {displayGroups()}
      </ul>
    </>
  )
}

export default Groups