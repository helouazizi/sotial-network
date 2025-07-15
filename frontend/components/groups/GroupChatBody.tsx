import { GroupsContext } from '@/context/GroupsContext'
import { GetGroupMessages } from '@/services/groupServices'
import React, { useContext, useEffect } from 'react'

const GroupChatBody = () => {
  const grpCtxt = useContext(GroupsContext)
  let data = grpCtxt?.currentGrp
  useEffect(() => {
    const fetcher = async () => {
      const message = await GetGroupMessages(data?.id)
    }
    if (data?.id) {
      fetcher()
    }
  }, [data?.id])
  return (
    <div className='chat-grp-body'>GroupChatBody</div>
  )
}

export default GroupChatBody