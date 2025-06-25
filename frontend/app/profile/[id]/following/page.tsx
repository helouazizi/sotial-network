"use client"
import Forbiden from '@/app/components/profile/Forbiden'
import { useProfile } from '@/app/context/ProfileContext'
import React from 'react'

const page = () => {
    const { dataProfile, setDataProfile } = useProfile()
    return (
        <div className="data-profile">
            {
                dataProfile?.myAccount || dataProfile?.im_follower ? <h3>hello</h3> : <Forbiden />
            }
        </div>
    )
}

export default page