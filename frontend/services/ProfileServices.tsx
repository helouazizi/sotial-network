"use client"

import { API_URL } from "./apiUrls";

export const obj = {
    Ofsset: 0,
    Limit: 20
}
export async function ChangeVisbiltiy(newVisibility: number, setDataProfile: (callback: (prev: any) => any) => void) {
    const req = await fetch(
        `${API_URL}api/v1/ChangeVisibilityProfile`,
        {
            method: "PUT",
            credentials: "include",
            body: JSON.stringify({
                to: newVisibility,
            }),
        }
    );

    if (req.ok) {
        setDataProfile((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                is_private: newVisibility,
            };
        });
    } else {
        throw new Error(await req.text())
    }
}

export async function UpdateProfile(file: File | undefined, nickname: string | undefined, about: string | undefined, oldAvatar: string | undefined, setDataProfile: (callback: (prev: any) => any) => void) {

    const formData = new FormData();

    if (file) {
        formData.append("updateImage", file);
    }
    if (nickname) {
        formData.append("nickname", nickname);
    }
    if (about) {
        formData.append("about", about);
    }
    if (oldAvatar) {
        formData.append("oldAvatar", oldAvatar)
    }
    const req = await fetch(`${API_URL}api/v1/UpdateProfile`, {
        method: "PUT",
        credentials: "include",
        body: formData
    })
    if (req.ok) {
        const resp = await req.json()


        if (file) {
            setDataProfile((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    avatar: resp.newPath,
                };
            })
        }
        if (nickname) {
            setDataProfile((prev) => {
                if (!prev) return prev
                return {
                    ...prev,
                    nickname: nickname,
                }
            })
        }
        if (about) {
            setDataProfile((prev) => {
                if (!prev) return prev
                return {
                    ...prev,
                    about_me: about,
                }
            })
        }
    }

}

export async function HandleRelations(status: string | undefined, profileUser: number | undefined, setDataProfile: (callback: (prev: any) => any) => void): Promise<{ ok: boolean; newStatus: string; haveAccess: boolean }> {
    try {
        const resp = await fetch(`${API_URL}api/v1/relations/realtions`, {
            method: "POST",
            credentials: 'include',
            body: JSON.stringify({
                profileID: profileUser,
                status: status,
            })
        })
        if (resp.ok) {
            let data = await resp.json()
            const newStatus = data.NewRelation.newStatus
            const haveAccess = data.NewRelation.haveAccess
            if (newStatus == "accepted" && haveAccess) {
                setDataProfile((prev) => {
                    if (!prev) return prev
                    return {
                        ...prev,
                        followers: prev.followers + 1,
                        im_follower: haveAccess,
                        subscription: {
                            ...prev.subscription,
                            status: newStatus,
                        }
                    }
                })
            } else if (newStatus == "follow") {
                setDataProfile((prev) => {
                    if (!prev) return prev
                    return {
                        ...prev,
                        followers: status != "pending" ? prev.followers - 1 : prev.followers,
                        im_follower: haveAccess,
                        subscription: {
                            ...prev.subscription,
                            status: newStatus,
                        }
                    }
                })
            } else if (newStatus == "pending") {
                setDataProfile((prev) => {
                    if (!prev) return prev
                    return {
                        ...prev,
                        im_follower: haveAccess,
                        subscription: {
                            ...prev.subscription,
                            status: newStatus,
                        }
                    }
                })
            }
            return { ok: true, newStatus, haveAccess }
        } else {
            return { ok: true, newStatus:"", haveAccess:false }
        }
    } catch (err) {
        console.error("Erreur dans HandleRelations :", err);
        return { ok: true, newStatus:"", haveAccess:false }
    }
}

export async function FetchUsersRl(id: number | undefined, type: string,) {
    try {
        const resp = await fetch(`${API_URL}api/v1/relations/getRealtions`, {
            method: "POST",
            credentials: 'include',
            body: JSON.stringify({
                profileID: id,
                type: type,
                limit: obj.Limit,
                ofsset: obj.Ofsset,
            })
        })
        if (resp.ok) {
            const dataUsers = await resp.json()
            if (dataUsers.NewRelation) {
                obj.Limit += 20
                obj.Ofsset += 20
                return dataUsers.NewRelation
            }
        }

    } catch (err) {
        console.error(err)
        return []
    }

}