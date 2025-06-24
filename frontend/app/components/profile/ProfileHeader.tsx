"use client";
import { useProfile } from '@/app/context/ProfileContext';
import React from 'react';
import Visibility from './Visibility';
import { FaUnlock } from 'react-icons/fa';
import { FaLock } from 'react-icons/fa6';
import ProfileStatique from './ProfileStatique';

const generateAvatar = (firstName?: string, lastName?: string) => {
  const firstInitial = firstName?.charAt(0).toUpperCase() || '';
  const lastInitial = lastName?.charAt(0).toUpperCase() || '';


  return `${firstInitial}${lastInitial}`;
};

const ProfileHeader = () => {
  const { dataProfile, setDataProfile } = useProfile()

  return (
    <div className="profile-header">
      <div className="left-sec">
        {dataProfile?.avatar ? (
          <img
            src={`http://localhost:8080/images/Auth/${dataProfile?.avatar}`}
            alt={`${dataProfile?.avatar}`}
            className="avatar-profile"
          />
        ) : (
          <div className="avatar-profile"><h2>{generateAvatar(dataProfile?.first_name, dataProfile?.last_name)}</h2></div>
        )}
        <div className="full-name-profile">
          <h3>{dataProfile?.first_name?.toUpperCase()} {dataProfile?.last_name?.toUpperCase()}  {dataProfile?.is_private == 1 ? <FaLock /> : <FaUnlock />}</h3>
          <span>@{dataProfile?.nickname}</span>
          <Visibility />
        </div>
      </div>
      <ProfileStatique />
    </div>
  );
};

export default ProfileHeader;
