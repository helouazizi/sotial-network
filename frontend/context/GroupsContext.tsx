"use client"

import { Group, GrpMesage } from "@/types/groups";
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

interface GroupsContextType {
    Groups: Group[] | null
    setGroups: Dispatch<SetStateAction<Group[] | null>>

}

export const GroupsContext = createContext<GroupsContextType | null>(null)
export function GroupsProvider({ children }: { children: ReactNode }) {
    const [Groups, setGroups] = useState<Group[] | null>(null)

    return (
        <GroupsContext.Provider value={{ Groups, setGroups }}>
            {children}
        </GroupsContext.Provider>
    )
}