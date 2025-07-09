"use client"
import Forbiden from '@/components/profile/Forbiden'
import UsersRl from '@/components/relation/UsersRl'
import { useProfile } from '@/context/ProfileContext'
import React from 'react'

const page = () => {
  const { dataProfile, setDataProfile } = useProfile()
  return (
    <div className="data-profile">
      {
        dataProfile?.myAccount || dataProfile?.im_follower ? <UsersRl type="followers"/> : <Forbiden />
      }
    </div>
  )
}

export default page