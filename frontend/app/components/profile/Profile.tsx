"use client";
import { ProfileInt } from "@/app/types/profiles";
import React, { useEffect } from "react";

const Profile = ({ profileid }: { profileid: string }) => {
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
        console.log(data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  });

  return <div>Profile</div>;
};

export default Profile;
