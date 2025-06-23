"use client";

import { ProfileInt } from "@/app/types/profiles";
import React, { useEffect, useState } from "react";
import ProfileHeader from "./ProfileHeader";
const Profile = ({ profileid }: { profileid: string }) => {
  const [dataProfile, setDataProfile] = useState<ProfileInt | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/v1/profile?id=${profileid}`,
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
  }, [profileid]);

  console.log("Fetched profile:", dataProfile);
  return (
    <div className="profile-container">
        <div className="profile-header">
          <ProfileHeader avatar={dataProfile?.avatar}/>
        </div>
    </div>
  );
};

export default Profile;
