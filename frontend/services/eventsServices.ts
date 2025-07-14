import { API_URL } from "."
import { Event, GroupMembers } from "@/types/events";

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

export const GetGroupMembers = async (group_id: string):Promise<GroupMembers> => {
    const res = await fetch(`${API_URL}api/v1/groups/joined/${group_id}/members`,
        {
            method: "GET",
            credentials: "include",
        }
    )

    if (!res.ok) throw new Error(await res.text());
    const members = await res.json()    
    return  members.data
}




export const VoteEvent = async ({id, vote } : {id : number , vote : string|null}) => {    
  const res = await fetch(`${API_URL}api/v1/groups/events/vote`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ id, vote }),
  });

  const response  = await res.json();
  
  return response;
};