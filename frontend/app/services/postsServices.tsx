import { json } from "stream/consumers"

const API_URL = "http://localhost:8080/api/v1/posts"



export const fetchComments = async (post_id: number) => {
    const res = await fetch(`${API_URL}getComments`,
        {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ post_id: post_id })

        }
    )
    if (!res.ok) throw new Error(await res.text());
    return await res.json()
}

export const addComment = async (post_id: number , comment : string) => {
    const res = await fetch(`${API_URL}addComment`,
        {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ post_id: post_id ,comment: comment})

        }
    )
    if (!res.ok) throw new Error(await res.text());
    return await res.json()
}

