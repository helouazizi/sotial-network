import { User } from "./user"
import { Group } from "./groups"

export interface Event {
    id : number,
    title : string ,
    description : string,
    event_date : string,
    created_at : string,
    vote : string | null,
    total_going : number,
    total_not_going : number,
    author : User
}

export interface GroupInfo {
    group : Group
    author : User
    total_members : number
}
