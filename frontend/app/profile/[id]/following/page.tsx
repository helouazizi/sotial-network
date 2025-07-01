"use client"
import Forbiden from '@/app/components/profile/Forbiden'
import UsersRl from '@/app/components/relation/UsersRl'
import { useProfile } from '@/app/context/ProfileContext'
import React from 'react'

const page = () => {
    const { dataProfile, setDataProfile } = useProfile()
    return (
        <div className="data-profile">
            {
                dataProfile?.myAccount || dataProfile?.im_follower ? <UsersRl type='followed' /> : <Forbiden />
            }
        </div>
    )
}

export default page