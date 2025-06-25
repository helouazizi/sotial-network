"use client"
import AboutProfileUser from '@/app/components/profile/AboutProfileUser'
import Forbiden from '@/app/components/profile/Forbiden'
import { useProfile } from '@/app/context/ProfileContext'
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