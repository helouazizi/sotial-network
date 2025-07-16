import { ParamValue } from "next/dist/server/request/params"
import { API_URL } from "."
import { GroupNotifications } from "@/types/Request"

export type groupType = "getJoined" | "getSuggested"

export async function createGroup(title: string, description: string) {
    try {
        const res = await fetch(API_URL + "api/v1/groups/create", {
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
    } catch (err) {
        console.error(err)
    }
}

export async function GetGroups(type: groupType) {
    try {
        const res = await fetch(API_URL + "api/v1/groups/" + type, {
            credentials: "include"
        })

        const data = await res.json()
        if (!res.ok) {
            console.error(data.error)
            return data
        }

        return data.data

    } catch (err) {
        console.error(err)
    }
}

export async function GetGroup(id: number) {
    try {
        const res = await fetch(API_URL + "api/v1/groups/joined/" + id, {
            credentials: "include"
        })

        const data = await res.json()
        if (!res.ok) {
            console.error(data.error)
            return data
        }
        return data.data

    } catch (err) {
        console.error(err)
    }
}



export async function GetInfoGrp(idGrp: ParamValue) {
    try {
        const resp = await fetch(`${API_URL}api/v1/groups/getInfoGroup?group_id=${idGrp}`, {
            method: 'GET',
            credentials: 'include',
        })
        const data = await resp.json()
        if (resp.ok) {
            return data.data
        }
    } catch (error) {
        console.error(error)
        return
    }
}

export async function SendJoinGroupRequest(body : GroupNotifications) {
    try {
        const res = await fetch(API_URL + "api/v1/groups/joinGroupRequest", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })

        const data = await res.json()
        if (!res.ok) {
            console.error(data.error)
            return null
        }

        return data
    } catch (err) {
        console.error(err)
        return
    }
}

export async function GetDemandeGroupNotifs() {
    try {
        const res = await fetch(API_URL + "api/v1/groups/getDemandeGroupNotifs", {
            credentials: "include"
        })

        const data = await res.json()

          console.log(data,"notifs sssssssssssssss");
        if (!res.ok) {
            console.error(data.error)
            return null
        }

        return data.data
    } catch (err) {
        console.error(err);
    }
}

export async function CancelGroupRequest(reqID: number) {
    try {
        const res = await fetch(API_URL+"api/v1/groups/cancelGroupRequest", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: reqID
            })
        })

        const data = await res.json()

        if (!res.ok) {
            console.log(data.error)
            return null
        }

        return data
    } catch (err) {
        console.error(err)
    }
}

export async function GetGroupMessages(id: number | undefined) {
    try {
        const res = await fetch(`${API_URL}api/v1/groups/getMsgsGroup?group_id=${id}`, {
            method: 'GET',
            credentials: 'include'
        })
        if (res.ok) {
            const data = await res.json()
            return data.messages;

        }
    } catch (err) {
        console.error(err);

    }
}