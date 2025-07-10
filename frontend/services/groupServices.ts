import { API_URL } from "."

export async function createGroup(title: string, description: string) {
    try {
        const res = await fetch(API_URL+"api/v1/groups/create", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title.trim(),
                description: description.trim()
            })
        })

        const data = await res.json()

        if (!res.ok) {
            console.error(data.error)
            return data
        }

        return data
    } catch(err) {
        console.error(err)
    }
}

export async function GetJoinedGroups() {
    try {
        const res = await fetch(API_URL+"api/v1/groups/getJoined", {
            credentials: "include"
        })

        const data = await res.json()
        if (!res.ok) {
            
        }

        return data.data

    } catch (err) {
        console.log(err)
    }
}