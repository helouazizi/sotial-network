"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ProfileInt } from "../types/profiles";

interface ProfileContextType {
    dataProfile: ProfileInt | null
    setDataProfile: React.Dispatch<React.SetStateAction<ProfileInt | null>>
}
const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children, profileId }: { children: React.ReactNode; profileId: string }) => {
    const [dataProfile, setDataProfile] = useState<ProfileInt | null>(null)
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8080/api/v1/profile?id=${profileId}`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );
                const data: ProfileInt = await res.json();
                setDataProfile(data);
            } catch (err) {
                console.error("Failed to fetch profprofileile:", err);
            }
        };

        fetchProfile();
    }, [profileId]);
    return (
        <ProfileContext.Provider value={{ dataProfile, setDataProfile }}>
            {children}
        </ProfileContext.Provider>
    )
}
export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error("useProfile must be used within a ProfileProvider");
    }
    return context;
};