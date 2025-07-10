"use client";
import { useProfile } from '@/context/ProfileContext';
import React from 'react';
import Visibility from './Visibility';
import { FaUnlock } from 'react-icons/fa';
import { FaLock } from 'react-icons/fa6';
import ProfileStatique from './ProfileStatique';

export const GenerateAvatar = (firstName?: string, lastName?: string) => {
  const firstInitial = firstName?.charAt(0).toUpperCase() || '';
  const lastInitial = lastName?.charAt(0).toUpperCase() || '';

  return `${firstInitial}${lastInitial}`;
};

const ProfileHeader = () => {
  const { dataProfile } = useProfile()
  return (
    <div className="profile-header">
      <div className="left-sec">
        {dataProfile?.User?.avatar ? (
          <img
            src={`http://localhost:8080/images/user/${dataProfile?.User?.avatar}`}
            alt={`${dataProfile?.User?.avatar}`}
            className="avatar-profile"
          />
        ) : (
          <div className="avatar-profile"><h2>{GenerateAvatar(dataProfile?.User?.firstname, dataProfile?.User?.lastname)}</h2></div>
        )}
        <div className="full-name-profile">
          <h3>{dataProfile?.User?.firstname?.toUpperCase()} {dataProfile?.User?.lastname?.toUpperCase()}  {dataProfile?.is_private == 1 ? <FaLock /> : <FaUnlock />}</h3>
          <span>@{dataProfile?.User?.nickname}</span>
          <Visibility />
        </div>
      </div>
      <ProfileStatique />
    </div>
  );
};

export default ProfileHeader;
