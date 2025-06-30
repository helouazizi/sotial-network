import { useProfile } from '@/app/context/ProfileContext'
import { HandleRelations } from '@/app/services/ProfileServices'
import { Debounce } from '@/app/utils/Debounce'
import React, { useCallback } from 'react'
import { FaP } from 'react-icons/fa6'

const ProfileStatique = () => {
  const { dataProfile, setDataProfile } = useProfile()
  const Submit = useCallback(Debounce(async () => {
    const status = dataProfile?.subscription?.status
    await HandleRelations(status, dataProfile?.id, setDataProfile)
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