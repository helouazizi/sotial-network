"use client"

import { SocketContext, SocketContextType } from '@/context/socketContext'
import { useCallback, useContext } from 'react'
import { IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5'
import { GenerateAvatar } from '../profile/ProfileHeader'
import { Debounce } from '@/utils/Debounce'

const FollowRequest = () => {
    const { ws, reqFollowers } = useContext(SocketContext) as SocketContextType
    //s followers
    const HandleReq = useCallback(Debounce(async (requestID: number, followerID: number, action: string) => {
        ws.current?.send(JSON.stringify({
            type: "HandleRequest",
            id: requestID,
            receiver_id: followerID,
            action: action
        }))
    }, 500), [])

    return (

        <div className='followers-requsets-container'>
            {
                reqFollowers.length > 0 ?
                    reqFollowers.map((follower, index) => {
                        return (
                            <div className="follower-request" key={index}>
                                <div className="header-card">
                                    {
                                        follower?.avatar ?
                                            <img
                                                src={`http://localhost:8080/images/user/${follower?.avatar}`}
                                                className="avatar-profile followers"
                                            />
                                            :
                                            <div className="avatar-profile followers"><h2>{GenerateAvatar(follower?.first_name, follower?.last_name)}</h2></div>
                                    }

                                    <div className="request-info">
                                        <h3>{follower?.last_name} {follower?.first_name}</h3>
                                        {
                                            follower?.nickname ?
                                                <span>@{follower?.nickname}</span>
                                                : ""
                                        }
                                    </div>
                                </div>
                                <div className="action-request">
                                    <IoCheckmarkCircle className='accept-request' role='button' onClick={() => { HandleReq(follower.request_id, follower.id, "accept") }} />
                                    <IoCloseCircle className='declanche-request' role='button' onClick={() => { HandleReq(follower.request_id, follower.id, "reject") }} />
                                </div>
                            </div>
                        )
                    })
                    : <h3 className='noReq'>No request</h3>}
        </div>
    )
}

export default FollowRequest
