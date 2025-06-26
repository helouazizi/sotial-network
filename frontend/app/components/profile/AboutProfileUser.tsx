"use client"
import { useProfile } from '@/app/context/ProfileContext'
import React, { useEffect, useState } from 'react'
import { GenerateAvatar } from './ProfileHeader';

const AboutProfileUser = () => {
    const { dataProfile, setDataProfile } = useProfile()
    const [avatar, setAvatar] = useState<string | undefined>(undefined)
    const [nickname, setNickname] = useState<string | undefined>(undefined)
    const [about, setAbout] = useState<string | undefined>(undefined)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    useEffect(() => {
        if (dataProfile?.avatar) setAvatar(`http://localhost:8080/images/user/${dataProfile?.avatar}`)
        if (dataProfile?.nickname) setNickname(dataProfile?.nickname)
        if (dataProfile?.about_me) setAbout(dataProfile?.about_me)
    }, [dataProfile?.avatar, dataProfile?.about_me, dataProfile?.nickname])
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
    const updateNickname = (e: React.FormEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        setNickname(target.value);
    }
    const updateAbout = (e: React.FormEvent<HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        setAbout(target.value);
    }
    return (
        <form >
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
                            <button className='submit' type='submit'>Submit Changes</button>
                            <input type="file" name="updateImage" id="updateImage" accept='image/jpeg, image/png, image/jpg' onChange={updateAvatar} />
                        </div> :
                        ""
                }

            </div>
            <div className="info-user">
                <div className="labels">
                    <div>First Name<span>:</span> </div>
                    <div>Last Name<span>:</span></div>
                    <div><span>Nickname {dataProfile?.myAccount ? <span className='editabel'>(editable)</span> : ""}</span><span>:</span> </div>
                    <div>Email<span>:</span> </div>
                    <div><span>About me {dataProfile?.myAccount ? <span className='editabel'>(editable)</span> : ""}</span><span>:</span> </div>
                </div>
                <div className="inputs">
                    <div><p>{dataProfile?.first_name}</p></div>
                    <div> <p>{dataProfile?.last_name}</p></div>
                    <div> {dataProfile?.myAccount ?
                        <input type="text" placeholder={nickname ? nickname : "nickname..."} onChange={updateNickname} />
                        :
                        <p>{nickname ? nickname : "-----"}</p>
                    }</div>
                    <div>
                        <p>{dataProfile?.email}</p>
                    </div>
                    <div> <textarea name="" id="" disabled={dataProfile?.myAccount ? false : true} defaultValue={about ? about : "-------"} onChange={updateAbout}></textarea></div>
                </div>

            </div>
        </form>
    )
}

export default AboutProfileUser