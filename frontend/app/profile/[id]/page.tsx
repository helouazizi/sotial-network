"use client"

import Forbiden from "@/app/components/profile/Forbiden";
import { useProfile } from "@/app/context/ProfileContext";

const ProfileServer = () => {

  const { dataProfile, setDataProfile } = useProfile()
  

  return (

    <div className="data-profile">
      <Forbiden/>
    </div>

  );
};

export default ProfileServer;