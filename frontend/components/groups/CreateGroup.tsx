"use client"

import React from "react"

function CreateGroup() {
    const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
    }

    return (
        <div className="create-group">
            <h2>Create a New Group</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Group Title" name="title" required />
                <textarea placeholder="Group Description" name="description" rows={4} required />
                <button type="submit">Create Group</button>
            </form>
        </div>
    )
}

export default CreateGroup