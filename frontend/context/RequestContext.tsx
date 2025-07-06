"use client";

import { NumOfREquests } from "@/types/Request";
import React, { createContext, useContext, useEffect, useState } from "react";


interface CountReqType {
    dataReqs: NumOfREquests | undefined
    setDataReqs: React.Dispatch<React.SetStateAction<NumOfREquests | undefined>>
}



const RequestContext = createContext<CountReqType | undefined>(undefined);

export const RequetsProvider = ({ children }: { children: React.ReactNode }) => {
    const [dataReqs, setDataReqs] = useState<NumOfREquests | undefined>(undefined)
    useEffect(() => {
        const fetchProfile = async () => {

            try {
                const res = await fetch(
                    `http://localhost:8080/api/v1/requests/getNumReq`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );
                if (!res.ok) throw new Error("Failed to fetch");
                const data: NumOfREquests = await res.json();
                setDataReqs(data);
            } catch (err) {
                console.error("Failed to fetch requests:", err);
            }

        }
        fetchProfile();
    }, [])
    return (
        <RequestContext.Provider value={{ dataReqs, setDataReqs }}>
            {children}
        </RequestContext.Provider>
    )
}
export const useRequest = () => {
    const context = useContext(RequestContext);
    if (!context) {
        throw new Error("useRequest must be used within a RequetsProvider");
    }
    return context;
};
