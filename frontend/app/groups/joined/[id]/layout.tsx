"use client"

import React, { ReactNode, useEffect } from 'react'
import SwitchButtons from '@/components/groups/SwitchButtons'
import { useParams, usePathname } from 'next/navigation';
import GroupHeader from '@/components/events/groupInfo';
import { GetGroupMembers } from '@/services/eventsServices';



function GroupPageLayout({ children }: { children: ReactNode }) {
  const url = usePathname()
  const { id } = useParams<{ id: string }>()
  console.log(url, id, "path");

  return (
    <div className='group-page'>
      <GroupHeader id={parseInt(id)} />
      <SwitchButtons firstButtonContent='Posts' secondButtonContent='Events' firstButtonLink={`/groups/joined/${id}/posts`} secondButtonLink={`/groups/joined/${id}/events`} />
      <div>
        {children}
      </div>
    </div>
  )
}

export default GroupPageLayout