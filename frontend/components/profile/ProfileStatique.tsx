"use client"
import { PopupContext } from '@/context/PopupContext'
import { useProfile } from '@/context/ProfileContext'
import { SocketContext, SocketContextType } from '@/context/socketContext'
import { HandleRelations } from '@/services/ProfileServices'
import { Debounce } from '@/utils/Debounce'
import React, { useCallback, useContext } from 'react'

const ProfileStatique = () => {
  const { ws, user } = useContext(SocketContext) as SocketContextType
  const { dataProfile, setDataProfile } = useProfile()
  const popup = useContext(PopupContext)

  const Submit = useCallback(Debounce(async () => {
    if (!user) return;
    const status = dataProfile?.subscription?.status
    const { ok, newStatus, haveAccess } = await HandleRelations(status, dataProfile?.User?.id, setDataProfile,popup)
    if (ok && newStatus == "pending" && !haveAccess) {

      ws.current?.send(JSON.stringify({
        type: "RelationSended",
        receiver_id: dataProfile?.User?.id,
        message: `${user?.firstname} ${user?.lastname} sended request follow.`,
        action: "demandFollow"
      }))
    }
    if (status == 'pending' && newStatus == 'follow') {
      ws.current?.send(JSON.stringify({
        type: "CancelRequest",
        receiver_id: dataProfile?.User?.id
      }))
    }
  }, 500), [dataProfile?.subscription?.status])
  const HandleRelation = (e: React.FormEvent) => {
    e.preventDefault()
    Submit()
  }
  return (
    <div className='statique-Profile'>
      <div className='numbers'>
        <div><p>POSTS</p><h1>{dataProfile?.nbPosts}</h1></div>
        <div><p>FOLLOWERS</p><h1>{dataProfile?.followers}</h1></div>
        <div><p>FOLLOWED</p><h1>{dataProfile?.followed}</h1></div>
      </div>
      {
        !dataProfile?.myAccount ?
          <button className={`${dataProfile?.subscription?.status}`} onClick={HandleRelation}>{dataProfile?.subscription?.status == "accepted" ? "unfollow" : dataProfile?.subscription?.status == "pending" ? "pending..." : "follow"}</button>
          : ""
      }
    </div>
  )
}

export default ProfileStatique