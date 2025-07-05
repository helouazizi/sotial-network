"use client"
import AboutProfileUser from '@/components/profile/AboutProfileUser'
import Forbiden from '@/components/profile/Forbiden'
import { useProfile } from '@/context/ProfileContext'
import React from 'react'

const page = () => {
  const { dataProfile, setDataProfile } = useProfile()

  return (
    <div className="data-profile">
      {
        dataProfile?.myAccount || dataProfile?.im_follower ?
          <AboutProfileUser />
          : <Forbiden />
      }
    </div>
  )
}

export default page