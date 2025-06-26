export interface User {
    id: number
    nickname: string
    firstName: string
    lastName: string
}

export interface Message {
    id: number 
    sender_id: number
    receiver_id: number
    message: string
}