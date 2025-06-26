"use client"
import { useProfile } from '@/app/context/ProfileContext'
import { Debounce } from '@/app/utils/Debounce'
import React, { useCallback, useState } from 'react'

const Visibility = () => {
    const { dataProfile, setDataProfile } = useProfile()
    const change = useCallback(
        Debounce(async () => {
            const req = await fetch("http://localhost:8080/api/v1/ChangeVisibilityProfile", {
                method: "POST",
                credentials: "include"
            })
            const resp = await req.json()

            if (resp.ok) {
                setDataProfile((prev) => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        is_private: prev.is_private === 1 ? 0 : 1,
                    };
                });
            }
        }, 300)
        , [])
    return (
        <>
            {
                dataProfile?.myAccount ?
                    <div className='switch-visibility'>
                        <label className="switch" >
                            <input type="checkbox" checked={dataProfile?.is_private == 1 ? true : false} onChange={change} />
                            <span className="slider"></span>
                        </label>
                        {dataProfile?.is_private == 1 ? <p style={{ color: "#5fdd54" }}>PUBLIC</p> : <p style={{ color: "red" }}>PRIVATE</p>}

                    </div>

                    :
                    ""
            }

        </>
    )
}

export default Visibility