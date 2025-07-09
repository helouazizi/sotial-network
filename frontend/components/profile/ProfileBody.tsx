import { useProfile } from '@/context/ProfileContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const ProfileBody = () => {
    const { dataProfile, setDataProfile } = useProfile()
    const path = usePathname()

    return (
        <div className='profile-body'>
            <ul className='navigation-profile'>
                <li >
                    <Link href={`/profile/${dataProfile?.id}`} style={{ borderTopLeftRadius: "8px" }} className={`${path == `/profile/${dataProfile?.id}` ? "active" : ""}`}>
                        POSTS
                    </Link>
                </li>
                <li >
                    <Link href={`/profile/${dataProfile?.id}/followers`} className={`${path == `/profile/${dataProfile?.id}/followers` ? "active" : ""}`} >
                        FOLLOWERS
                    </Link>
                </li>
                <li >
                    <Link href={`/profile/${dataProfile?.id}/following`} className={`${path == `/profile/${dataProfile?.id}/following` ? "active" : ""}`}>
                        FOLLOWING
                    </Link>
                </li>
                <li >
                    <Link href={`/profile/${dataProfile?.id}/about`} style={{ borderTopRightRadius: "8px" }} className={`${path == `/profile/${dataProfile?.id}/about` ? "active" : ""}`}>
                        ABOUT
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default ProfileBody