"use client"
import { useProfile } from '@/app/context/ProfileContext'
import { FetchUsersRl } from '@/app/services/ProfileServices'
import { ProfileInt } from '@/app/types/profiles'
import React, { useEffect, useState } from 'react'

const UsersRl = (props: { type: string }) => {
    const { dataProfile, setDataProfile } = useProfile()
    const [data, setData] = useState<ProfileInt[] | null>(null)
    const [loadingRl, setLoadingRl] = useState(false)
    const { type } = props
    let limit = 15; let ofsset = 0
    useEffect(() => {
        const GetRelations = async () => {
            await FetchUsersRl(dataProfile?.id, type, limit, ofsset, setData, setLoadingRl)
        }
        GetRelations()
    }, [type])

    return (
        <div>UsersRl</div>
    )
}

export default UsersRl