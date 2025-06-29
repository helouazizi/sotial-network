import React from 'react'

const Toast = ({ type, message }: { type: string, message: string }) => {
    return (
        <div className='toast'>
            <p>{message}</p>
        </div>
    )
}

export default Toast