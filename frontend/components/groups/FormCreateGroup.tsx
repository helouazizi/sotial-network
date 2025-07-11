"use client"

import { GroupsContext } from "@/context/GroupsContext"
import { PopupContext } from "@/context/PopupContext"
import { createGroup } from "@/services/groupServices"
import React, { useCallback, useContext, useRef, useState } from "react"

function throttle(func: (...args: any[]) => void, delay = 3000) {
    let timer: NodeJS.Timeout | null = null
    return (...args: any[]) => {
        if (!timer) {
            func(...args)
            timer = setTimeout(() => {
                timer = null
            }, delay)
        }
    }
}

function FormCreateGroup() {
    const title = useRef<HTMLInputElement | null>(null)
    const description = useRef<HTMLTextAreaElement | null>(null)
    const [titleError, setTitleError] = useState<string>('')
    const [descriptionError, setDescriptionError] = useState<string>('')
    const context = useContext(PopupContext)
    const groupsContext = useContext(GroupsContext)

    const throttledSubmit = useCallback(throttle(async () => {
        if (!title.current?.value.trim() || !description.current?.value.trim()) {
            return
        }

        setTitleError('')
        setDescriptionError('')

        let res = await createGroup(title.current?.value, description.current?.value)
        if (res.error?.includes("title")) {
            setTitleError(res.error)
            return
        }

        if (res.error?.includes("description")) {
            setDescriptionError(res.error)
            return
        }

        context?.showPopup("success", res.message)
        title.current.value = ""
        description.current.value = ""
        
        if (res.data) groupsContext?.setJoinedGroups(prev => prev ? [res.data,...prev] : [res.data])
    }, 5000), [])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        throttledSubmit()
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