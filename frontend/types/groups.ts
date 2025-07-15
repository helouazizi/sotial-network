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
    sender_id: number
    group_id: number
    avatar: string
    fullName: string
    message: string
    sent_at: string
}