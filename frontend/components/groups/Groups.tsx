"use client"

import { GetGroups, groupType } from '@/services/groupServices'
import Link from 'next/link';
import React, { use, useContext, useEffect, useState } from 'react'
import { MdGroups } from "react-icons/md";
import SwitchButtons from './SwitchButtons';
import { GroupsContext } from '@/context/GroupsContext';
import { usePathname } from 'next/navigation';
import { PopupContext } from '@/context/PopupContext';

function Groups() {
  const context = useContext(GroupsContext)
  const pathname = usePathname()
  const popup = useContext(PopupContext)

  useEffect(() => {
    const fetchGroups = async () => {
      if ((pathname.startsWith("/groups/joined") && !context?.Groups) || pathname === "/groups/suggested") {
        let type: groupType = pathname.startsWith("/groups/joined") ? "getJoined" : "getSuggested"
        const data = await GetGroups(type)
        if (data.error) {
          popup?.showPopup("faild", "Ooops, something wrong!!")
          return
        }
        context?.setGroups(data)
      }
    }

    fetchGroups()
  }, [pathname])

  const displayGroups = () => {
    return context?.Groups?.map((group, index) => {
      let title = group.title.length > 25 ? group.title.slice(0, 25).trim() + "..." : group.title
      let path = pathname.startsWith("/groups/joined") ? "/groups/joined/" + group.id + "/posts" : ""

      return (
        <li key={index}>
          <Link href={path}><span><MdGroups /></span> <p>{title}</p></Link>
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