export interface Post {
    id : number,
    userId : number
    body : string,
    title : string,
    author:string,
    createdAt:string
    avatarUrl: string
    likes:number,
    dislikes:number,
    totalComments:number,
    comments: []
}