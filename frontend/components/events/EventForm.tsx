'use client'

import { useContext, useState } from 'react'
import { API_URL } from "@/services/index"
import { useParams } from 'next/navigation'
import { PopupContext } from '@/context/PopupContext'


interface EventData {
    title: string
    description: string
    datetime: string
}

export default function EventForm() {
    const [form, setForm] = useState<EventData>({
        title: '',
        description: '',
        datetime: '',
    })

    const [submitting, setSubmitting] = useState(false)
    const Popup = useContext(PopupContext)

    const { id } = useParams<{ id: string }>();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        const body = {
            group_id: id ? parseInt(id, 10) : 0,
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
                setForm({ title: '', description: '', datetime: '' })
                Popup?.showPopup("success", data.message)
                return
            }else{
                console.log(data,"dtat");
                
                 Popup?.showPopup("faild", data.error)
            }
        } catch (err) {
            Popup?.showPopup("faild", 'Something went wrong. Try again.')
        } finally {
            setSubmitting(false)
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

                <button type="submit" disabled={submitting} className="event-submit-btn">
                    {submitting ? 'Creating...' : 'Create Event'}
                </button>
            </form>
        </div>
    )
}
