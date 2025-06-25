"use client"
import { useProfile } from '@/app/context/ProfileContext'
import React, { useEffect, useState } from 'react'
import { GenerateAvatar } from './ProfileHeader';

const AboutProfileUser = () => {
    const { dataProfile, setDataProfile } = useProfile()
    const [avatar, setAvatar] = useState<string | undefined>(undefined)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    useEffect(() => {
        if (dataProfile?.avatar) setAvatar(`http://localhost:8080/images/user/${dataProfile?.avatar}`)
    }, [dataProfile?.avatar])
    const updateAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {

        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            setAvatar(URL.createObjectURL(file))
        }

    }
    const removeUpdatedImage = (e: React.FormEvent) => {
        e.preventDefault()
        setAvatar(`http://localhost:8080/images/user/${dataProfile?.avatar}`)
    }
    return (
        <form>
            <div className="updateImage">
                {avatar ? (
                    <img
                        src={avatar}
                        className="avatar-profile About"
                    />
                ) : (
                    <div className="avatar-profile"><h2>{GenerateAvatar(dataProfile?.first_name, dataProfile?.last_name)}</h2></div>
                )}
                {
                    dataProfile?.myAccount ?
                        <div>
                            <label htmlFor="updateImage">Update Avatar</label>
                            <button disabled={avatar === `http://localhost:8080/images/user/${dataProfile?.avatar}` ? true : false} onClick={removeUpdatedImage}>Annuler</button>
                            <button className='submit'>Submit Changes</button>
                            <input type="file" name="updateImage" id="updateImage" accept='image/jpeg, image/png, image/jpg' onChange={updateAvatar} />
                        </div> :
                        ""
                }

            </div>
            <div className="info-user">
                <div className="details">
                    <label>First Name<span>:</span> </label>
                    <p>{dataProfile?.first_name}</p>
                </div>
                <div className="details">
                    <label>Last Name<span>:</span></label>
                    <p>{dataProfile?.last_name}</p>
                </div>
                <div className="details">
                    <label>Nickname {dataProfile?.myAccount ? <span>(editable)</span> : ""}<span>:</span> </label>
                    {dataProfile?.nickname ?
                        <p>{dataProfile?.nickname ? dataProfile?.nickname : "---"}</p> :
                        <input type='text' />
                    }
                </div>
                <div className="details">
                    <label>Email<span>:</span> </label>
                    <p>{dataProfile?.email}</p>
                </div>
                <div className="details">
                    <label>About me {dataProfile?.myAccount ? <span>(editable)</span> : ""}<span>:</span> </label>
                    <textarea name="" id="" disabled={dataProfile?.myAccount ? false : true}>{dataProfile?.about_me ? dataProfile?.first_name : ""}</textarea>
                </div>
            </div>
        </form>
    )
}

export default AboutProfileUser