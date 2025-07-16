"use client"

import { SocketContext } from '@/context/socketContext'
import { GetDemandeGroupNotifs } from '@/services/groupServices'
import { GroupNotifications, NumOfREquests } from '@/types/Request'
import React, { useContext, useEffect, useState } from 'react'
import { IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5'
import PostHeader from '../post/postHeader'

const GroupeRequest = () => {
  const { ws, numsNotif, setNumNotif, notifications, setNotifications } = useContext(SocketContext) ?? {}

  useEffect(() => {
    const fetchDemandeGroupNotifs = async () => {
      const data = await GetDemandeGroupNotifs()
      if (!data) {
        return
      }

      if (setNotifications) setNotifications(data)
    }
    fetchDemandeGroupNotifs()
  }, [])

  const handleRequest = (requestID: number, senderID: number, groupID: number, action: string, type: string) => {
    if (ws?.current) {
      ws.current.send(JSON.stringify({
        "id": requestID,
        "action": action,
        "receiver_id": senderID,
        "group_id": groupID,
        "type": "handleGroupReq",
        "request_type": type
      }))

      // let newGroupNumberNotif = Number(numsNotif?.groupeReqCount)  - 1
      // const countotifs: NumOfREquests = {
      //   followersCount: numsNotif?.followersCount || 0,
      //   groupeReqCount: newGroupNumberNotif,
      //   total: Number(numsNotif?.followersCount) + newGroupNumberNotif
      // };

      // if (setNumNotif) setNumNotif(countotifs);
    }

    if (setNotifications) setNotifications(prev => [...(prev?.filter(p => p.id != requestID) || [])])
  }

  const displayRequests = () => {
    return notifications?.map((req, index) => {
      return (
        <div key={index} className='request-card'>
          <div className="request-card-header">
            <PostHeader author={req.user?.firstname + " " + req.user?.lastname} avatarUrl={req.user?.avatar} createdAt='' firstname={req.user?.firstname || ''} lastname={req.user?.lastname || ''} />
            <p className='request-type'>{req.type.charAt(0).toUpperCase() + req.type.slice(1,)}</p>
          </div>
          <div className='action-request'>
            <p>{req.group?.title}</p>
          </div>
          <div className='group-action-request'>
            <button className='group-request-btn accept' onClick={() => handleRequest(req.id || 0, req.sender_id || 0, req.group_id, "accept", req.type)}><IoCheckmarkCircle /></button>
            <button className='group-request-btn reject' onClick={() => handleRequest(req.id || 0, req.sender_id || 0, req.group_id, "reject", req.type)}><IoCloseCircle /></button>
          </div>

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