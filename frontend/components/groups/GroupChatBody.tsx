import { GroupsContext } from '@/context/GroupsContext'
import { GetGroupMessages } from '@/services/groupServices'
import React, { useContext, useEffect } from 'react'
import { GenerateAvatar } from '../profile/ProfileHeader'
import { SocketContext } from '@/context/socketContext'

const GroupChatBody = () => {
  const { ws, user } = useContext(SocketContext) ?? {}
  const grpCtxt = useContext(GroupsContext)
  let data = grpCtxt?.currentGrp
  useEffect(() => {
    const fetcher = async () => {
      const message = await GetGroupMessages(data?.id)
      grpCtxt?.setMsgGrp(message)
    }
    if (data?.id) {
      fetcher()
    }
  }, [data?.id])

  if (ws?.current) {
    ws.current.onmessage = (e: MessageEvent) => {
      let res = JSON.parse(e.data);
      if (res.type == "NewMsgGrp") {

        let message = res.message;
        if (message?.group_id == data?.id) {
          grpCtxt?.setMsgGrp((prev) => {
            if (!prev) return [message]
            return [...prev, message]
          })
        }

      };
    }
  }
  return (
    <div className='chat-grp-body'>
      {
        grpCtxt?.msgGrp?.map((ele, ind) => {
          let name = ele.fullName.split(" ")
          let me = ele.sender_id == user?.id

          console.log(me);

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