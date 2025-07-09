export interface User {
    id: number
    nickname: string
    firstName: string
    lastName: string
    avatar: string
}

export interface Message {
    id: number
    sender_id: number
    receiver_id: number
    message: string
    sent_at_str: string
}