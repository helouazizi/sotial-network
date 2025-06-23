"use client";

import { ProfileInt } from "@/app/types/profiles";
import React, { useEffect, useState } from "react";

const Profile = ({ profileid }: { profileid: string }) => {
  const [dataProfile, setDataProfile] = useState({})
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
        setDataProfile(data)
        console.log(dataProfile);

      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  });

  return (
    <div>

    </div>
  )
};

export default Profile;
