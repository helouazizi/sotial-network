import { API_URL } from ".";

export const getGroupComments = async (post_id: number) => {
    const res = await fetch(`${API_URL}api/v1/groups/post/getcomment`,
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

export const addGroupComment = async (post_id: number, comment: string, img: File | null) => {
    const form = new FormData();
    form.append("post_id", post_id.toString())
    form.append("comment", comment)
    if (img) form.append("image", img)
    const res = await fetch(`${API_URL}api/v1/groups/post/addcomment`,
        {
            method: "POST",
            credentials: "include",
            body: form
        }
    )
    if (res.status === 401) {
        window.location.href = "/login"
        return null
    }
    if (!res.ok) throw new Error(await res.text());
    return await res.json()
}
