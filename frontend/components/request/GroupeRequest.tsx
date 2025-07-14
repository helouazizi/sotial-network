"use client"

import { GetDemandeGroupNotifs } from '@/services/groupServices'
import { GroupNotifications } from '@/types/Request'
import React, { useEffect, useState } from 'react'

const GroupeRequest = () => {
  const [notifications, setNotifications] = useState<GroupNotifications | null>(null)

  useEffect(() => {
    const fetchDemandeGroupNotifs = async () => {
      const data = await GetDemandeGroupNotifs()

      // console.log(data)
    }

    fetchDemandeGroupNotifs()
  }, [])

  return (
    <div>GroupeRequest</div>
  )
}

export default GroupeRequest