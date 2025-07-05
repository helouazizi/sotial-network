"use client"

import Forbiden from "@/components/profile/Forbiden";
import { useProfile } from "@/context/ProfileContext";

const ProfileServer = () => {

  const { dataProfile, setDataProfile } = useProfile()
  


  return (

    <div className="data-profile">
      {
        dataProfile?.myAccount || dataProfile?.im_follower?<h3>hello</h3>:<Forbiden />
      }
    </div>

  );
};

export default ProfileServer;