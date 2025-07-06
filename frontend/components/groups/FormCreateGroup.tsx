"use client"

import { createGroup } from "@/services/groupServices"
import React, { useRef } from "react"

function FormCreateGroup() {
    const title = useRef<HTMLInputElement | null>(null)
    const description = useRef<HTMLTextAreaElement | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!title.current?.value.trim() || !description.current?.value.trim()) {
            return
        }

        let res = await createGroup(title.current?.value, description.current?.value)
        if (res) {
            console.log(res)
        }

    }

    return (
        <div className="create-group">
            <h2>Create a New Group</h2>
            <form onSubmit={handleSubmit}>
                <input ref={title} type="text" placeholder="Group Title" name="title" required />
                <textarea ref={description} placeholder="Group Description" name="description" rows={4} required />
                <button type="submit">Create Group</button>
            </form>
        </div>
    )
}

export default FormCreateGroup