"use client"
import { useProfile } from '@/context/ProfileContext'
import React, { useCallback, useEffect, useState } from 'react'
import { GenerateAvatar } from './ProfileHeader';
import Toast from '../toast/Toast';
import { Debounce } from '@/utils/Debounce';
import { UpdateProfile } from '@/services/ProfileServices';

const AboutProfileUser = () => {
    const { dataProfile, setDataProfile } = useProfile()
    const [avatar, setAvatar] = useState<string | undefined>(undefined)
    const [nickname, setNickname] = useState<string | undefined>(undefined)
    const [about, setAbout] = useState<string | undefined>(undefined)
    const [showError, setShowError] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined)

    useEffect(() => {
        if (dataProfile?.User?.avatar) setAvatar(`http://localhost:8080/images/user/${dataProfile?.User?.avatar}`)
        if (dataProfile?.User?.nickname) setNickname(dataProfile?.User?.nickname)
        if (dataProfile?.User?.aboutme) setAbout(dataProfile?.User?.aboutme)
    }, [dataProfile?.User?.avatar, dataProfile?.User?.aboutme, dataProfile?.User?.nickname])


    const updateAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {

        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)

            setAvatar(URL.createObjectURL(file))
        }

    }
    const removeUpdatedImage = (e: React.FormEvent) => {
        e.preventDefault()
        if (dataProfile?.User?.avatar) {
            setAvatar(`http://localhost:8080/images/user/${dataProfile?.User?.avatar}`)
        } else {
            setAvatar(undefined)
        }
    }
    const updateNickname = (e: React.FormEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        setNickname(target.value);
    }
    const updateAbout = (e: React.FormEvent<HTMLTextAreaElement>) => {
        const target = e.target as HTMLTextAreaElement;
        setAbout(target.value);
    }
    const debouncedSubmit = useCallback(
        Debounce(async () => {
            if (
                (avatar === `http://localhost:8080/images/user/${dataProfile?.User?.avatar}` || !avatar) &&
                (about === dataProfile?.User?.aboutme || !about) &&
                (nickname === dataProfile?.User?.nickname || !nickname)
            ) {
                setShowError(true)
                return
            }

            await UpdateProfile(selectedFile, nickname, about, dataProfile?.User?.avatar, setDataProfile)
            setShowError(false)


        }, 500),
        [avatar, about, nickname, dataProfile]
    )

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault()
        debouncedSubmit()
    }


    return (
        <>

            <form onSubmit={submitForm} encType='multipart/form-data'>
                <div className="updateImage">
                    {avatar ? (
                        <img
                            src={avatar}
                            className="avatar-profile About"
                        />
                    ) : (
                        <div className="avatar-profile"><h2>{GenerateAvatar(dataProfile?.User?.firstname, dataProfile?.User?.lastname)}</h2></div>
                    )}
                    {
                        dataProfile?.myAccount ?
                            <div>
                                <label htmlFor="updateImage">Update Avatar</label>
                                <button disabled={avatar === `http://localhost:8080/images/user/${dataProfile?.User?.avatar}` ? true : false} onClick={removeUpdatedImage}>Annuler</button>
                                <button className='submit' type='submit'>Submit Changes</button>
                                {showError ? <Toast type='fail' message='Do some changes before submitting.' /> : ""}
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
                        <div><p>{dataProfile?.User?.firstname}</p></div>
                        <div> <p>{dataProfile?.User?.lastname}</p></div>
                        <div> {dataProfile?.myAccount ?
                            <input type="text" placeholder={nickname ? nickname : "nickname..."} onChange={updateNickname} />
                            :
                            <p>{nickname ? nickname : "-----"}</p>
                        }</div>
                        <div>
                            <p>{dataProfile?.User?.email}</p>
                        </div>
                        <div> <textarea disabled={dataProfile?.myAccount ? false : true} defaultValue={dataProfile?.User?.aboutme ? dataProfile?.User?.aboutme : "-------"} onChange={updateAbout}></textarea></div>
                    </div>

                </div>
            </form>
        </>
    )
}

export default AboutProfileUser