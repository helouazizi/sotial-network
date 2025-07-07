"use client"
import { SocketContext, SocketContextType } from '@/context/socketContext'
import React, { useContext, useEffect, useState } from 'react'
import { IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5'

const FollowRequest = () => {
    const { ws } = useContext(SocketContext) as SocketContextType
    const [hasRequested, setHasRequested] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            const socket = ws.current
            if (socket && socket.readyState === WebSocket.OPEN && !hasRequested) {
                socket.send(JSON.stringify({ type: "GetFollowersRequest" }))
                setHasRequested(true)
                clearInterval(interval)
            }
        }, 200)

        return () => clearInterval(interval)
    }, [ws, hasRequested])

    return (
        <>
            {hasRequested ?
                <div className='followers-requsets-container'>
                    <div className="follower-request">
                        <div className="header-card">
                            <img
                                src={`http://localhost:8080/images/user/1751798198_aaaaaaaa.jpeg`}
                                className="avatar-profile followers"
                            />
                            <div className="request-info">
                                <h3>Ismail SAYEN</h3>
                                <span>@isayen</span>
                            </div>
                        </div>
                        <div className="action-request">
                            <IoCheckmarkCircle className='accept-request' />
                            <IoCloseCircle className='declanche-request' />
                        </div>
                    </div>
                </div> :
                <p>Loading</p>
            }
        </>
    )
}

export default FollowRequest
