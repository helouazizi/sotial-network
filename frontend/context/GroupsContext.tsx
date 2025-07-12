"use client"

import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

interface GroupsContextType {
    joinedGroups: Group[] | null
    setJoinedGroups: Dispatch<SetStateAction<Group[] | null>>
}

export const GroupsContext = createContext<GroupsContextType | null>(null)

export function GroupsProvider({children} : {children: ReactNode}) {
    const [joinedGroups, setJoinedGroups] = useState<Group[] | null>(null)

    return (
        <GroupsContext.Provider value={{joinedGroups, setJoinedGroups}}>
            {children}
        </GroupsContext.Provider>
    )
}