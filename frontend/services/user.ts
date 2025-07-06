import { API_URL } from ".";

export async function getUserInfos() {
    try {   
        const res = await fetch(API_URL+"api/v1/user/infos", {
            credentials: "include"
        })
        return await res.json()
    } catch (err) {
        console.log(err)
        return {}
    }
}