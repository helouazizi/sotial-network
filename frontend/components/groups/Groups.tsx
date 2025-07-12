"use client"

import { GetJoinedGroups } from '@/services/groupServices'
import Link from 'next/link';
import React, { useContext, useEffect } from 'react'
import { MdGroups } from "react-icons/md";
import SwitchButtons from './SwitchButtons';
import { GroupsContext } from '@/context/GroupsContext';

function Groups() {
  const context = useContext(GroupsContext)

  useEffect(() => {
    const fetchGroups = async () => {
      const data = await GetJoinedGroups()
      context?.setJoinedGroups(data)
    }

    fetchGroups()
  }, [])

  const displayGroups = () => {
    return context?.joinedGroups?.map((group, index) => {
      let title = group.title.length > 25 ? group.title.slice(0, 25).trim() + "..." : group.title

      return (
        <li key={index}>
          <Link href={"/groups/joined/" + group.id}><span><MdGroups /></span> <p>{title}</p></Link>
        </li>
      )
    })
  }

  return (
    <>
      <SwitchButtons firstButtonContent='joined' secondButtonContent='suggested' firstButtonLink='/groups/joined' secondButtonLink='/groups/suggested'/>
      <ul className='joinedGroups'>
        {displayGroups()}
      </ul>
    </>
  )
}

export default Groups