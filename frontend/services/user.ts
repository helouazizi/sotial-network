import { API_URL } from ".";

export async function getUserInfos() {
    try {   
        const res = await fetch(API_URL+"api/v1/user/infos", {
            credentials: "include"
        })
        return await res.json()
    } catch (err) {
        console.error(err)
        return {}
    }
}

export async function GetFriends() {
    try {
        const res = await fetch(API_URL+"api/v1/user/friends", {
            credentials: "include"
        })

        const data = await res.json()

        if (res.ok) {
            return data.data
        }
    } catch (err) {
        console.error(err)
    }
}