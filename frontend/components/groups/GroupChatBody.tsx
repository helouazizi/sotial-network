import { GroupsContext } from '@/context/GroupsContext'
import { GetGroupMessages } from '@/services/groupServices'
import React, { useContext, useEffect, useRef } from 'react'
import { GenerateAvatar } from '../profile/ProfileHeader'
import { SocketContext } from '@/context/socketContext'

const GroupChatBody = () => {
  const { user, currentGrp, msgGrp, setMsgGrp } = useContext(SocketContext) ?? {}

  const ChatBody = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const fetcher = async () => {
      const message = await GetGroupMessages(currentGrp?.id)
      
      setMsgGrp?.((prev) => {
        if (!prev) return []
        return message
      })
    }
    if (currentGrp?.id) {
      fetcher()
    }
  }, [currentGrp?.id])
  useEffect(() => {
    if (ChatBody.current) {
      ChatBody.current.scrollTop = ChatBody.current.scrollHeight
    }
  }, [msgGrp])


  return (
    <div ref={ChatBody} className='chat-grp-body'>
      {
        msgGrp?.map((ele, ind) => {
          let name = ele.fullName.split(" ")
          let me = ele.sender_id == user?.id


          return (
            <div className={`card-msg-grp ${me ? "my-msg" : ""}`} key={ind}>
              {ele.avatar ? (
                <img
                  src={`http://localhost:8080/images/user/${ele.avatar}`}
                  alt={`${ele.avatar}`}
                  className="avatar-profile user-msg-avatar"
                />
              ) : (
                <div className="avatar-profile user-msg-avatar"><h2>{GenerateAvatar(name[0], name[1])}</h2></div>
              )}
              <div className='info-user-msg'>
                <h4 className='username-msg'>{ele.fullName}</h4>
                <p className='user-msg'>{ele.message}</p>
                <p className='date-msg'>{ele.sent_at}</p>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

export default GroupChatBody