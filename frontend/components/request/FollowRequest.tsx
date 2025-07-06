import React from 'react'
import { IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5'

const FollowRequest = () => {
    return (
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
                    <IoCheckmarkCircle className='accept-request'/>
                    <IoCloseCircle className='declanche-request'/>
                </div>
            </div>
            
        </div>
    )
}

export default FollowRequest