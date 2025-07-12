import { API_URL } from "."
import { Event } from "@/types/events";
export const GetEvents = async (group_id: number):Promise<Event[]> => {
    const res = await fetch(`${API_URL}api/v1/groups/joined/${group_id}/events`,
        {
            method: "GET",
            credentials: "include",
        }
    )
    if (!res.ok) throw new Error(await res.text());
    const events = await res.json()
    return  events.data
}