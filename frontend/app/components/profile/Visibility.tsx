import { useProfile } from '@/app/context/ProfileContext'
import React from 'react'

const Visibility = () => {
    const { dataProfile, setDataProfile } = useProfile()
    const change = () => {

        setDataProfile((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                is_private: prev.is_private === 1 ? 0 : 1,
            };
        });
    };
    return (
        <>
            {
                dataProfile?.myAccount ?
                    <>
                        <label className="switch" >
                            <input type="checkbox" checked={dataProfile?.is_private == 1 ? true : false} onChange={change} />
                            <span className="slider"></span>
                        </label>
                        {dataProfile?.is_private == 1 ? <p>switch to PUBLIC</p> : <p>switch to PRIVATE</p>}
                    </>
                    :
                    ""
            }

        </>
    )
}

export default Visibility