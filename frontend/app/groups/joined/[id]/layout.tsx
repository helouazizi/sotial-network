"use client"

import React, { ReactNode } from 'react'
import SwitchButtons from '@/components/groups/SwitchButtons'
import { useParams, usePathname } from 'next/navigation';


function GroupPageLayout({ children }: { children: ReactNode }) {
  const url = usePathname()
  const {id} = useParams()
  console.log(url , id , "path");
  
  
  return (
    <div className='group-page'>
      {/* add group info here  */}
      <SwitchButtons firstButtonContent='Posts' secondButtonContent='Events' firstButtonLink={`/groups/joined/${id}/posts`} secondButtonLink={`/groups/joined/${id}/events`} />
      <div>
        {children}
      </div>
    </div>
  )
}

export default GroupPageLayout