"use client"
import ProfileBody from '@/app/components/profile/ProfileBody'
import ProfileHeader from '@/app/components/profile/ProfileHeader'
import { ProfileProvider } from '@/app/context/ProfileContext'
import { useParams } from 'next/navigation'
import React, { Children, ReactNode } from 'react'

const ProfileLayout = ({ children }: { children: ReactNode }) => {
    const params = useParams()
    const id = params.id as string
    return (
        <ProfileProvider profileId={id}>
            <main>
                <div className="profile-container">
                    <ProfileHeader />
                    <ProfileBody />
                    {children}
                </div>
            </main>
        </ProfileProvider>
    )
}

export default ProfileLayout