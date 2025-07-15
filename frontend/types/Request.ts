import { User } from "./user"

export interface NumOfREquests {
    groupeReqCount: Number
    followersCount: Number
    total: Number
}

export interface GroupNotifications {
    id?: number
    group_id: number
    sender_id?: number
    requested_id: number
    type: string
    user?: User
}