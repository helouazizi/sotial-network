"use client"
import { useProfile } from '@/app/context/ProfileContext'
import { FetchUsersRl } from '@/app/services/ProfileServices'
import { ProfileInt } from '@/app/types/profiles'
import Link from 'next/link'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { GenerateAvatar } from '../profile/ProfileHeader'
import { IoIosArrowForward } from 'react-icons/io'
import { Throttle } from '@/app/utils/Throttle'

const UsersRl = (props: { type: string }) => {
    const { dataProfile, setDataProfile } = useProfile()
    const [data, setData] = useState<ProfileInt[]>([])
    const { type } = props

    let limit = useRef(0); let ofsset = useRef(8)
    useEffect(() => {
        const GetRelations = async () => {

            if (dataProfile?.id) {
                ofsset.current = 0
                limit.current = 8
                let result = await FetchUsersRl(dataProfile.id, type, limit.current, ofsset.current)
                setData(result)
            }
        }
        GetRelations()
    }, [type])

    const ScrollUser = useCallback(
        Throttle(async () => {
            console.log(ofsset.current, limit.current);

            let result = await FetchUsersRl(dataProfile?.id, type, limit.current, ofsset.current)
            setData((prev) => [...prev, ...result])
            ofsset.current = data.length
            limit.current = data.length + 1
        }, 1000)
        , [])
    return (
        <div className='relation-section' onScroll={ScrollUser}>
            {
                data.map((ele, key) => {
                    return (
                        <Link href={`/profile/${ele?.id}`} key={key} className='relation-card' >
                            <div className='relation-card-data'>
                                {ele?.avatar ? (
                                    <img
                                        src={`http://localhost:8080/images/user/${ele?.avatar}`}
                                        alt={`${ele?.avatar}`}
                                        className="avatar-profile card"
                                    />
                                ) : (
                                    <div className="avatar-profile card"><h2>{GenerateAvatar(ele?.first_name, ele?.last_name)}</h2></div>
                                )}
                                <div className="info">
                                    <h3>{ele.first_name} {ele.last_name}</h3>
                                    {
                                        ele?.nickname ?
                                            <span>@{ele?.nickname}</span>
                                            : ""
                                    }
                                </div>
                            </div>
                            <IoIosArrowForward />
                        </Link >
                    )
                })
            }

        </div>
    )
}

export default UsersRl