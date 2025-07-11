"use client"

import Popup from "@/components/Popup";
import { createContext, ReactNode, useContext, useState } from "react";

interface PopupContextType {
    showPopup: (type: popupType, message: string) => void
}

export const PopupContext = createContext<PopupContextType | null>(null)

type popupType = "success" | "faild";

export function PopupProvider({children} : {children: ReactNode}) {
    const [message, setMessage] = useState("");
    const [type, setType] = useState<popupType>("success");
    const [visible, setVisible] = useState(false);

    const showPopup = (type: popupType = "success", message: string) => {
        setMessage(message)
        setType(type)
        setVisible(true)
        setTimeout(() => setVisible(false), 5000);
    }

    return (
        <PopupContext.Provider value={{showPopup}}>
            {children}
            {visible && <Popup type={type} message={message}/>}
        </PopupContext.Provider>
    )
}

