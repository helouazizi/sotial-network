import { useProfile } from '@/app/context/ProfileContext'
import Link from 'next/link'
import React from 'react'

const ProfileBody = () => {
    const { dataProfile, setDataProfile } = useProfile()

    return (
        <div className='profile-body'>
            <ul className='navigation-profile'>
                <li style={{ borderTopLeftRadius: "8px", borderBottomLeftRadius: "8px" }}>
                    <Link href={`/profile/${dataProfile?.id}/posts`}>
                        POSTS
                    </Link>
                </li>
                <li>
                    <Link href={`/profile/${dataProfile?.id}/followers`}>
                        FOLLOWERS
                    </Link>
                </li>
                <li>
                    <Link href={`/profile/${dataProfile?.id}/following`}>
                        FOLLOWING
                    </Link>
                </li>
                <li style={{ borderTopRightRadius: "8px", borderBottomRightRadius: "8px" }}>
                    <Link href={`/profile/${dataProfile?.id}/about`}>
                        ABOUT
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default ProfileBody