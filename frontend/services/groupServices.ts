import { ParamValue } from "next/dist/server/request/params"
import { API_URL } from "."

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
        return
    } catch (error) {
        console.error(error)
        return
    }
}