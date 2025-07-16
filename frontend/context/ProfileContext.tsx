"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ProfileInt } from "../types/profiles";
import { useRouter } from "next/navigation";
import { PopupContext } from "./PopupContext";

interface ProfileContextType {
    dataProfile: ProfileInt | null;
    setDataProfile: React.Dispatch<React.SetStateAction<ProfileInt | null>>;
    loading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({
    children,
    profileId,
}: {
    children: React.ReactNode;
    profileId: string;
}) => {
    const router = useRouter()
    const popup = useContext(PopupContext)
    const [dataProfile, setDataProfile] = useState<ProfileInt | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `http://localhost:8080/api/v1/profile?id=${profileId}`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );
                if (res.ok) {
                    const data: ProfileInt = await res.json();
                    setDataProfile(data);
                } else {
                    router.push("/")
                    popup?.showPopup("faild", "No user found 404.")
                }
            } catch (err) {
                console.error("Failed to fetch profile:", err);
                popup?.showPopup("faild", "Server error 500. Try later.")

            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [profileId]);
    return (
        <ProfileContext.Provider value={{ dataProfile, setDataProfile, loading }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error("useProfile must be used within a ProfileProvider");
    }
    return context;
};
