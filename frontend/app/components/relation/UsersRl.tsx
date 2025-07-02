"use client"
import { useProfile } from '@/app/context/ProfileContext'
import { FetchUsersRl } from '@/app/services/ProfileServices'
import { ProfileInt } from '@/app/types/profiles'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { GenerateAvatar } from '../profile/ProfileHeader'
import { IoIosArrowForward } from 'react-icons/io'

const UsersRl = (props: { type: string }) => {
    const { dataProfile, setDataProfile } = useProfile()
    const [data, setData] = useState<ProfileInt[]>([])
    const { type } = props

    let limit = 0; let ofsset = 0
    useEffect(() => {
        const GetRelations = async () => {

            if (dataProfile?.id) {
                ofsset = data.length
                limit = data.length + 20
                await FetchUsersRl(dataProfile.id, type, limit, ofsset, setData)
            }
        }
        GetRelations()
    }, [])


    return (
        <div className='relation-section'>
            {
                data.map((ele, key) => {
                    return (
                        <Link href={`/profile/${ele?.id}`} key={key} className='relation-card'>
                            <div className='relation-card-data'>
                                {ele?.avatar ? (
                                    <img
                                        src={`http://localhost:8080/images/user/${ele?.avatar}`}
                                        alt={`${ele?.avatar}`}
                                        className="avatar-profile card"
                                    />
                                ) : (
                                    <div className="avatar-profile card"><h2>{GenerateAvatar(dataProfile?.first_name, dataProfile?.last_name)}</h2></div>
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