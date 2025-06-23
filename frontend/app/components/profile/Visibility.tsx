import { useProfile } from '@/app/context/ProfileContext'
import React from 'react'
import { FaLock, FaUnlock } from 'react-icons/fa'

const Visibility = () => {
    const { dataProfile, setDataProfile } = useProfile()
    return (
        <>
            {
                dataProfile?.myAccount ?
                    <label className="switch">
                        <input type="checkbox" />
                        <span className="slider"></span>
                    </label> :
                    ""
            }
        </>
    )
}

export default Visibility