"use client"

import { GetJoinedGroups } from '@/services/groupServices'
import React, { useEffect, useState } from 'react'
import { MdGroups } from "react-icons/md";

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
      let title = group.title.length > 20 ? group.title.slice(0,20).trim() + "..." : group.title
      
      return (
        <li key={index}>
          <span><MdGroups /></span> <p>{title}</p>
        </li>
      )
    })
  }

  return (
    <ul className='joinedGroups'>
      {displayGroups()}
    </ul>
  )
}

export default Groups