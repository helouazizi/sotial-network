export interface Group {
    id: number
    user_id: number
    title: string
    description: string
    created_at: string
    count_members: number
    members: string[]
    request_id?: number | null
}