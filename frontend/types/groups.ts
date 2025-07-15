export interface Group {
    id: number
    user_id: number
    title: string
    description: string
    created_at: string
    count_members: number
    members: string[]
}
export interface GrpMesage {
    id: number
    senderID: number
    groupID: number
    sentAt: string
    avatar: string
    fullName: string
    message: string
    sent_at:string
}