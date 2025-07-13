import { User } from "./user"

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