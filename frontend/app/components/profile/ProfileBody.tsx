import { useProfile } from '@/app/context/ProfileContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const ProfileBody = () => {
    const { dataProfile, setDataProfile } = useProfile()
    const path = usePathname()
    const styleLeft = {

    }
    return (
        <div className='profile-body'>
            <ul className='navigation-profile'>
                <li style={{ borderTopLeftRadius: "8px", borderBottomLeftRadius: `${path == `/profile/${dataProfile?.id}` ? "0px" : "8px"}` }} className={`${path == `/profile/${dataProfile?.id}` ? "active" : ""}`}>
                    <Link href={`/profile/${dataProfile?.id}`}>
                        POSTS
                    </Link>
                </li>
                <li className={`${path == `/profile/${dataProfile?.id}/followers` ? "active" : ""}`}>
                    <Link href={`/profile/${dataProfile?.id}/followers`} >
                        FOLLOWERS
                    </Link>
                </li>
                <li className={`${path == `/profile/${dataProfile?.id}/following` ? "active" : ""}`}>
                    <Link href={`/profile/${dataProfile?.id}/following`} >
                        FOLLOWING
                    </Link>
                </li>
                <li style={{ borderTopRightRadius: "8px", borderBottomRightRadius: `${path == `/profile/${dataProfile?.id}/about` ? "0px" : "8px"}` }} className={`${path == `/profile/${dataProfile?.id}/about` ? "active" : ""}`}>
                    <Link href={`/profile/${dataProfile?.id}/about`}>
                        ABOUT
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default ProfileBody