"use client"

import { GetJoinedGroups } from '@/services/groupServices'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { MdGroups } from "react-icons/md";
import SwitchButtons from './SwitchButtons';

function Groups() {
  const [joinedGroups, setJoinedGroups] = useState<Group[] | null>(null)

  useEffect(() => {
    const fetchGroups = async () => {
      const data = await GetJoinedGroups()
      setJoinedGroups(data)
    }

    fetchGroups()
  }, [])

  const displayGroups = () => {
    return joinedGroups?.map((group, index) => {
      let title = group.title.length > 20 ? group.title.slice(0, 20).trim() + "..." : group.title

      return (
        <li key={index}>
          <Link href={"/groups/joined/" + group.id}><span><MdGroups /></span> <p>{title}</p></Link>
        </li>
      )
    })
  }

  return (
    <>
      <SwitchButtons firstButtonContent='joined' secondButtonContent='suggested'/>
      <ul className='joinedGroups'>
        {displayGroups()}
      </ul>
    </>
  )
}

export default Groups