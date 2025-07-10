import { useProfile } from '@/context/ProfileContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const ProfileBody = () => {
    const { dataProfile } = useProfile()
    const path = usePathname()

    return (
        <div className='profile-body'>
            <ul className='navigation-profile'>
                <li >
                    <Link href={`/profile/${dataProfile?.User?.id}`} style={{ borderTopLeftRadius: "8px" }} className={`${path == `/profile/${dataProfile?.User?.id}` ? "active" : ""}`}>
                        POSTS
                    </Link>
                </li>
                <li >
                    <Link href={`/profile/${dataProfile?.User?.id}/followers`} className={`${path == `/profile/${dataProfile?.User?.id}/followers` ? "active" : ""}`} >
                        FOLLOWERS
                    </Link>
                </li>
                <li >
                    <Link href={`/profile/${dataProfile?.User?.id}/following`} className={`${path == `/profile/${dataProfile?.User?.id}/following` ? "active" : ""}`}>
                        FOLLOWING
                    </Link>
                </li>
                <li >
                    <Link href={`/profile/${dataProfile?.User?.id}/about`} style={{ borderTopRightRadius: "8px" }} className={`${path == `/profile/${dataProfile?.User?.id}/about` ? "active" : ""}`}>
                        ABOUT
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default ProfileBody