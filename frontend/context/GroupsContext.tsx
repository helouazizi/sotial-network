"use client"

import { Group } from "@/types/groups";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { SocketContext } from "./socketContext";

interface GroupsContextType {
    Groups: Group[] | null
    setGroups: Dispatch<SetStateAction<Group[] | null>>
    currentGrp: Group | null
    setCurrentGrp: Dispatch<SetStateAction<Group | null>>
}

export const GroupsContext = createContext<GroupsContextType | null>(null)
export function GroupsProvider({ children }: { children: ReactNode }) {
    const [Groups, setGroups] = useState<Group[] | null>(null)
    const [currentGrp, setCurrentGrp] = useState<Group | null>(null)
    return (
        <GroupsContext.Provider value={{ Groups, setGroups, currentGrp, setCurrentGrp }}>
            {children}
        </GroupsContext.Provider>
    )
}