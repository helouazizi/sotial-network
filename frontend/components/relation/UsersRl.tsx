"use client"
import { useProfile } from '@/context/ProfileContext'
import { FetchUsersRl, obj } from '@/services/ProfileServices'
import { ProfileInt } from '@/types/profiles'
import Link from 'next/link'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { GenerateAvatar } from '../profile/ProfileHeader'
import { IoIosArrowForward } from 'react-icons/io'
import { Throttle } from '@/utils/Throttle'
import { FaSearchMinus } from 'react-icons/fa'
import { PopupContext } from '@/context/PopupContext'

const UsersRl = (props: { type: string }) => {
    const { dataProfile } = useProfile()
    const [data, setData] = useState<ProfileInt[]>([])
    const popup = useContext(PopupContext)
    const { type } = props


    useEffect(() => {
        const GetRelations = async () => {
            if (dataProfile?.User?.id) {
                obj.Ofsset = 0
                obj.Limit = 20
                let result = await FetchUsersRl(dataProfile.User?.id, type,popup)
                setData(result)
            }
        }
        GetRelations()
    }, [dataProfile?.User?.id, type])

    const ScrollUser = useCallback(
        Throttle(async () => {
            let result = await FetchUsersRl(dataProfile?.User?.id, type,popup)
            if (result) {
                setData((prev) => [...prev, ...result])
            }
        }, 1500)
        , [dataProfile?.User?.id, type])
    return (
        <>
            {data?.length > 0 ?
                <div className='relation-section' onScroll={ScrollUser}>
                    {
                        data?.map((ele, key) => {
                            return (
                                <Link href={`/profile/${ele?.User?.id}`} key={key} className='relation-card' >
                                    <div className='relation-card-data'>
                                        {ele?.User?.avatar ? (
                                            <img
                                                src={`http://localhost:8080/images/user/${ele?.User?.avatar}`}
                                                alt={`${ele?.User?.avatar}`}
                                                className="avatar-profile card"
                                            />
                                        ) : (
                                            <div className="avatar-profile card"><h2>{GenerateAvatar(ele?.User?.firstname, ele?.User?.lastname)}</h2></div>
                                        )}
                                        <div className="info">
                                            <h3>{ele?.User?.firstname} {ele?.User?.lastname}</h3>
                                            {
                                                ele?.User?.nickname ?
                                                    <span>@{ele?.User?.nickname}</span>
                                                    : ""
                                            }
                                        </div>
                                    </div>
                                    <IoIosArrowForward />
                                </Link >

                            )
                        })
                    }

                </div> :
                <div className='empty-data'>
                    <FaSearchMinus />
                    <h4>No data available</h4>
                    <h4>Once data is added, it will appear here.</h4>
                </div>
            }
        </>
    )
}

export default UsersRl