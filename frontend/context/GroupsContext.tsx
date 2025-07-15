"use client"

import { Group, GrpMesage } from "@/types/groups";
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

interface GroupsContextType {
    Groups: Group[] | null
    setGroups: Dispatch<SetStateAction<Group[] | null>>
    currentGrp: Group | null
    setCurrentGrp: Dispatch<SetStateAction<Group | null>>
    msgGrp: GrpMesage[] | null
    setMsgGrp: Dispatch<SetStateAction<GrpMesage[] | null>>
}

export const GroupsContext = createContext<GroupsContextType | null>(null)
export function GroupsProvider({ children }: { children: ReactNode }) {
    const [Groups, setGroups] = useState<Group[] | null>(null)
    const [currentGrp, setCurrentGrp] = useState<Group | null>(null)
    const [msgGrp, setMsgGrp] = useState<GrpMesage[] | null>(null)
    return (
        <GroupsContext.Provider value={{ Groups, setGroups, currentGrp, setCurrentGrp, msgGrp, setMsgGrp }}>
            {children}
        </GroupsContext.Provider>
    )
}