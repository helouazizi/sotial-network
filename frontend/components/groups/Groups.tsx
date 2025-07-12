"use client"

import { GetJoinedGroups, GetSuggestedGroups } from '@/services/groupServices'
import Link from 'next/link';
import React, { use, useContext, useEffect, useState } from 'react'
import { MdGroups } from "react-icons/md";
import SwitchButtons from './SwitchButtons';
import { GroupsContext } from '@/context/GroupsContext';
import { usePathname } from 'next/navigation';

function Groups() {
  const context = useContext(GroupsContext)
  const pathname = usePathname()
  const [isFetch, setIsFetch] = useState<boolean>(false)

  useEffect(() => {
    const fetchGroups = async () => {
      if (pathname === "/groups/joined") {
        const data = await GetJoinedGroups()
        context?.setGroups(data)
      } else if (pathname === "/groups/suggested") {
        const data = await GetSuggestedGroups()
        context?.setGroups(data)
      }
    }

    fetchGroups()
  }, [pathname])

  const handleClick = () => {

    setIsFetch(prev => !prev)
  }

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
      <SwitchButtons handleClick={handleClick} firstButtonContent='joined' secondButtonContent='suggested' firstButtonLink='/groups/joined' secondButtonLink='/groups/suggested' />
      <ul className='joinedGroups'>
        {displayGroups()}
      </ul>
    </>
  )
}

export default Groups