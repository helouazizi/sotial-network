import React, { useEffect, useRef, useState } from 'react'
import { MdOutlineEmojiEmotions } from "react-icons/md";


function EmojiList({ textarea }: { textarea: HTMLTextAreaElement | null }) {
    const [showEmojiList, setShowEmojiList] = useState<boolean>(true)
    const wrapperRef = useRef<HTMLDivElement>(null)

    const emojiList = ["😀", "😂", "😍", "🥲", "👍", "❤️", "🔥", "😎", "😭", "🙏"]

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowEmojiList(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])


    const handleEmojiClick = (emoji: string) => {
        if (textarea) {
            const start = textarea.selectionStart
            const end = textarea.selectionEnd
            const text = textarea.value
            textarea.value = text.slice(0, start) + emoji + text.slice(end)
            textarea.selectionStart = textarea.selectionEnd = start + emoji.length
            textarea.focus()
        }
    }

    const displayEmojiList = () => {
        return emojiList.map((e, i) => {
            return (
                <span onClick={() => handleEmojiClick(e)} key={i}>
                    {e}
                </span>
            )
        })
    }

    return (
        <div ref={wrapperRef} className="emoji-wrapper">
            <button
                className={`emoji-toggle ${showEmojiList ? "active" : ""}`}
                onClick={() => setShowEmojiList(prev => !prev)}
            >
                <MdOutlineEmojiEmotions />
            </button>

            {showEmojiList && (
                <div className={`emoji-list ${showEmojiList ? "active" : ""}`}>
                    {displayEmojiList()}
                </div>
            )}
        </div>

    )
}

export default EmojiList