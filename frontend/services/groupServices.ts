import { API_URL } from "."

export async function createGroup(title: string, description: string) {
    try {
        const res = await fetch(API_URL+"api/v1/createGroup", {
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
        return
    }
}

export async function GetJoinedGroups() {
    try {
        const res = await fetch(API_URL)
    } catch (err) {
        console.log(err)
    }
}