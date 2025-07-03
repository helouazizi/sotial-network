"use client"
import { useProfile } from '@/app/context/ProfileContext'
import { FetchUsersRl, obj } from '@/app/services/ProfileServices'
import { ProfileInt } from '@/app/types/profiles'
import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'
import { GenerateAvatar } from '../profile/ProfileHeader'
import { IoIosArrowForward } from 'react-icons/io'
import { Throttle } from '@/app/utils/Throttle'
import { FaSearchMinus } from 'react-icons/fa'

const UsersRl = (props: { type: string }) => {
    const { dataProfile, setDataProfile } = useProfile()
    const [data, setData] = useState<ProfileInt[]>([])
    const { type } = props


    useEffect(() => {
        const GetRelations = async () => {
            if (dataProfile?.id) {
                obj.Ofsset = 0
                obj.Limit = 20
                let result = await FetchUsersRl(dataProfile.id, type)
                setData(result)
            }
        }
        GetRelations()
    }, [dataProfile?.id, type])

    const ScrollUser = useCallback(
        Throttle(async () => {
            let result = await FetchUsersRl(dataProfile?.id, type)
            console.log(result);
            if (result) {
                setData((prev) => [...prev, ...result])
            }

        }, 1500)
        , [dataProfile?.id, type])
    return (
        <>
            {data?.length > 0 ?
                <div className='relation-section' onScroll={ScrollUser}>
                    {
                        data?.map((ele, key) => {
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