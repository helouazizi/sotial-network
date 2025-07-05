"use client";

import ProfileBody from '@/components/profile/ProfileBody';
import ProfileHeader from '@/components/profile/ProfileHeader';
import { ProfileProvider, useProfile } from '@/context/ProfileContext';
import { useParams } from 'next/navigation';
import React, { ReactNode } from 'react';

const ProfileLayoutInner = ({ children }: { children: ReactNode }) => {
    const { loading } = useProfile();

    if (loading) {
        return (
            <div className="loader"></div>
        );
    }

    return (
        <div className="profile-container">
            <ProfileHeader />
            <ProfileBody />
            {children}
        </div>
    );
};

const ProfileLayout = ({ children }: { children: ReactNode }) => {
    const params = useParams();
    const id = params.id as string;

    return (
        <ProfileProvider profileId={id}>
            <main>
                <ProfileLayoutInner>{children}</ProfileLayoutInner>
            </main>
        </ProfileProvider>
    );
};

export default ProfileLayout;
