import { SocketContext, SocketContextType } from '@/context/socketContext'
import React, { useContext } from 'react'
import { FaRegCircleCheck } from 'react-icons/fa6'

const NotifToast = () => {
    const { messageNotif } = useContext(SocketContext) as SocketContextType
    return (
        <div className='NotifToast'>
            <FaRegCircleCheck />
            <div>
                <h3>New <strong>Follow</strong> request.</h3>
                <p>{messageNotif}</p>
            </div>
        </div>
    )
}

export default NotifToast