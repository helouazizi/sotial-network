"use client"
import { useProfile } from '@/app/context/ProfileContext'
import { FetchUsersRl } from '@/app/services/ProfileServices'
import { ProfileInt } from '@/app/types/profiles'
import React, { useEffect, useState } from 'react'

const UsersRl = (props: { type: string }) => {
    const { dataProfile, setDataProfile } = useProfile()
    const [data, setData] = useState<ProfileInt[]>([])
    const [loadingRl, setLoadingRl] = useState(false)
    const { type } = props

    let limit = 15; let ofsset = 0
    useEffect(() => {
        const GetRelations = async () => {

            if (dataProfile?.id) {
                console.log("ssss");
                await FetchUsersRl(dataProfile.id, type, limit, ofsset, setData, setLoadingRl)
            }
        }
        GetRelations()
    }, [])


    return (
        <>        {loadingRl && <div className="loader"></div>}
            <div>
                {
                    data.map((ele, key) => {
                        return (
                            <div key={key}>
                                <p>{ele?.first_name}</p>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}

export default UsersRl