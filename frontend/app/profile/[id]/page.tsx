"use client"

import Forbiden from "@/components/profile/Forbiden";
import PostsProfile from "@/components/profile/PostsProfile";
import { useProfile } from "@/context/ProfileContext";

const ProfileServer = () => {
  const { dataProfile } = useProfile()
  
  return (
    <div className="data-profile">
      {
        dataProfile?.myAccount || dataProfile?.im_follower ? <PostsProfile posts={dataProfile?.posts}/> : <Forbiden />
      }
    </div>

  );
};

export default ProfileServer;