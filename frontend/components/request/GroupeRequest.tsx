"use client"

import { SocketContext } from '@/context/socketContext'
import { GetDemandeGroupNotifs } from '@/services/groupServices'
import { GroupNotifications } from '@/types/Request'
import React, { useContext, useEffect, useState } from 'react'

const GroupeRequest = () => {
  const [notifications, setNotifications] = useState<GroupNotifications[] | null>(null)
  const {ws} = useContext(SocketContext) ?? {}

  useEffect(() => {
    const fetchDemandeGroupNotifs = async () => {
      const data = await GetDemandeGroupNotifs()
      if (!data) {
        return
      }

      setNotifications(data)
    }

    fetchDemandeGroupNotifs()
  }, [])

  const handleRequest = (requestID: number, senderID: number, groupID: number ,action: string) => {
    if (ws?.current) {
      ws.current.send(JSON.stringify({
        "id": requestID,
        "action": action,
        "receiver_id": senderID,
        "group_id": groupID,
        "type": "handleGroupReq"
      }))
    }
  }

  const displayRequests = () => {
    return notifications?.map((req, index) => {
      return (
        <div key={index} className='request-card'>
            <p>{req.user?.firstname} {req.user?.lastname}</p>
            <button onClick={() => handleRequest(req.id || 0,req.sender_id || 0, req.group_id,"accept")}>Accept</button>
            <button onClick={() => handleRequest(req.id || 0,req.sender_id || 0, req.group_id,"reject")}>Reject</button>
            <hr />
        </div>
      )
    })
  }

  return (
    <div className='groups-requests-container'>
      {displayRequests()}
    </div>
  )
}

export default GroupeRequest