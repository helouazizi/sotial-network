'use client'

import { useContext, useState } from 'react'
import { API_URL } from "@/services/index"
import { PopupContext } from '@/context/PopupContext'
import { Event } from '@/types/events'
import { SocketContext } from "@/context/socketContext"; // Adjust path if different



interface EventData {
    title: string
    description: string
    datetime: string
}
interface EventFromProps {
    group_id: number,
    onCreate: (newEvent: Event) => void;
}


export default function EventForm({ group_id, onCreate }: EventFromProps) {
    const [form, setForm] = useState<EventData>({
        title: '',
        description: '',
        datetime: '',
    })
    
    const Popup = useContext(PopupContext)
    const { user } = useContext(SocketContext) ?? {}




    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value.trim() })
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
      

        // Validate form data
        if (!form.title?.trim() || form.title.trim().length > 300) {
            Popup?.showPopup("faild", "Title can't be empty or longer than 300 characters.");
            return;
        }

        if (!form.description?.trim() || form.description.trim().length > 500) {
            Popup?.showPopup("faild", "Description can't be empty or longer than 500 characters.");
            return;
        }

        if (!form.datetime || new Date(form.datetime) <= new Date()) {
            Popup?.showPopup("faild", "Please select a future date and time for the event.");
            return;
        }




        const body = {
            group_id: group_id,
            title: form.title,
            description: form.description,
            event_date: new Date(form.datetime).toISOString(),
        }

        try {
            const response = await fetch(`${API_URL}api/v1/groups/events/create`, {
                method: 'POST',
                credentials: "include",
                body: JSON.stringify(body),
            })
            const data = await response.json()
            if (response.ok) {
                const newEvent: Event = {
                    id: data.data.id,
                    title: form.title,
                    description: form.description,
                    event_date: form.datetime,
                    total_going : 0,
                    total_not_going : 0,
                    vote: null,
                    created_at: new Date().toISOString(),
                    author: {
                        nickname: user?.nickname ?? "You",
                        firstname: user?.firstname ?? "",
                        lastname: user?.lastname ?? "",
                        avatar: user?.avatar ?? "",
                        aboutme: user?.aboutme ?? "",
                        dateofbirth: user?.dateofbirth ?? "",
                        email: user?.email ?? "",
                        id: user?.id ?? 0
                    }
                }
                onCreate(newEvent)
                setForm({ title: '', description: '', datetime: '' })
                Popup?.showPopup("success", data.message)
                return
            } else {
                Popup?.showPopup("faild", data.error)
            }
        } catch (err) {
            Popup?.showPopup("faild", 'Something went wrong. Try again.')
        } 
    }

    return (
        <div className="event-form-container">
            <h2 className="event-form-title">Create New Event</h2>
            <form onSubmit={handleSubmit} className="event-form-wrapper">
                <div className="event-form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        required
                        value={form.title}
                        onChange={handleChange}
                        className="event-form-input"
                    />
                </div>

                <div className="event-form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        required
                        rows={3}
                        value={form.description}
                        onChange={handleChange}
                        className="event-form-input"
                    />
                </div>

                <div className="event-form-group">
                    <label htmlFor="datetime">Day & Time</label>
                    <input
                        id="datetime"
                        name="datetime"
                        type="datetime-local"
                        required
                        value={form.datetime}
                        onChange={handleChange}
                        className="event-form-input"
                    />
                </div>

                <div className="event-form-group">
                    <label>Options</label>
                    <div className="event-options">
                        <span className="event-badge badge-going">Going</span>
                        <span className="event-badge badge-notgoing">Not Going</span>
                    </div>
                    <p className="text-muted">Users will be able to choose after event is created.</p>
                </div>

                <button type="submit" className="event-submit-btn">
                  Create Event
                </button>
            </form>
        </div>
    )
}
