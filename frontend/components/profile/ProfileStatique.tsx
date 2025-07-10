"use client"
import { useProfile } from '@/context/ProfileContext'
import { SocketContext, SocketContextType } from '@/context/socketContext'
import { HandleRelations } from '@/services/ProfileServices'
import { Debounce } from '@/utils/Debounce'
import React, { useCallback, useContext } from 'react'

const ProfileStatique = () => {
  const { ws } = useContext(SocketContext) as SocketContextType
  const { dataProfile, setDataProfile } = useProfile()
  const Submit = useCallback(Debounce(async () => {
    const status = dataProfile?.subscription?.status
    const { ok, newStatus, haveAccess } = await HandleRelations(status, dataProfile?.id, setDataProfile)
    if (ok && newStatus == "pending" && !haveAccess) {
      console.log("hna");
      ws.current?.send(JSON.stringify({
        type: "RelationSended",
        receiver_id: dataProfile?.id
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
        <div><p>followers</p><h1>{dataProfile?.followers}</h1></div>
        <div><p>followed</p><h1>{dataProfile?.followed}</h1></div>
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