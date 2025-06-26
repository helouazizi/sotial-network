export interface User {
    id: number
    nickname: string
    firstName: string
    lastName: string
}

export interface Messages {
    id: number 
    senderId: number
    receiverId: number
    message: string
}