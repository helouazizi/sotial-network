import { useProfile } from '@/app/context/ProfileContext'
import React from 'react'

const ProfileStatique = () => {
  const { dataProfile, setDataProfile } = useProfile()
  console.log(dataProfile);

  return (
    <div className='statique-Profile'>
      <div className='numbers'>
        <div><p>POSTS</p><h1>{dataProfile?.nbPosts}</h1></div>
        <div><p>followers</p><h1>{dataProfile?.followers}</h1></div>
        <div><p>followed</p><h1>{dataProfile?.followed}</h1></div>
      </div>
      {
        !dataProfile?.myAccount ?

          <button className={`${dataProfile?.subscription?.status}`}>{dataProfile?.subscription?.status}</button>

          : ""
      }
    </div>
  )
}

export default ProfileStatique