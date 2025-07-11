import React from 'react'

import { GrValidate } from "react-icons/gr";
import { MdOutlineSmsFailed } from "react-icons/md";

function Popup({ type = "success", message }: { type?: string, message: string }) {
    const iconType = type === "success" ? <GrValidate /> : <MdOutlineSmsFailed />
    const classType = type === "success" ? "successPopup" : "faildPopup"

    return (
        <div className={"popup "+classType}>{iconType} {message}</div>
    )
}

export default Popup