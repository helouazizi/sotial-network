"use client"

import { createGroup } from "@/services/groupServices"
import React, { useRef, useState } from "react"

function FormCreateGroup() {
    const title = useRef<HTMLInputElement | null>(null)
    const description = useRef<HTMLTextAreaElement | null>(null)
    const [titleError, setTitleError] = useState<string>('')
    const [descriptionError, setDescriptionError] = useState<string>('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!title.current?.value.trim() || !description.current?.value.trim()) {
            return
        }

        setTitleError('')
        setDescriptionError('')
        
        let res = await createGroup(title.current?.value, description.current?.value)
        if (res.error?.includes("title")) {
            setTitleError(res.error)
        }

        if (res.error?.includes("description")) {
            setDescriptionError(res.error)
        }
    }

    return (
        <div className="create-group">
            <h2>Create a New Group</h2>
            <form onSubmit={handleSubmit}>
                <input maxLength={100} ref={title} type="text" placeholder="Group Title" name="title" required />
                {titleError && <span>{titleError}</span>}
                <textarea maxLength={1000} ref={description} placeholder="Group Description" name="description" rows={4} required />
                {descriptionError && <span>{descriptionError}</span>}
                <button type="submit">Create Group</button>
            </form>
        </div>
    )
}

export default FormCreateGroup