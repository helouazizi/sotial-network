
import { Follower } from "@/types/post";

const API_URL = "http://localhost:8080/api/v1/posts"

export const getComments = async (post_id: number) => {
    const res = await fetch(`${API_URL}/getComments`,
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

export const addComment = async (post_id: number, comment: string, img: File | null) => {
    const form = new FormData();
    form.append("post_id", post_id.toString())
    form.append("comment", comment)
    if (img) form.append("image", img)
    const res = await fetch(`${API_URL}/addComment`,
        {
            method: "POST",
            credentials: "include",
            body: form

        }
    )
    if (!res.ok) throw new Error(await res.text());
    return await res.json()
}


export const votePost = async (post_id: number, action: "like" | "dislike" | "unlike" | "undislike") => {
    const res = await fetch(`${API_URL}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ post_id: post_id, action }),
    });
    if (res.status === 401) {
        window.location.href = "/login";
        return null;
    }
    if (!res.ok) {
        throw new Error("Vote action failed");
    }
    return res;
};


export const GetFolowers = async (): Promise<Follower[]> => {
    const res = await fetch(`${API_URL}/folowers`, {
        method: "GET",
        credentials: "include",
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch followers: ${errorText}`);
    }
    const folowers = await res.json();

    console.log(folowers, "folowers")

    return folowers
};