"use client"

import { AiOutlineMessage } from "react-icons/ai";

export default function Chat() {
  return (
    <div className="noChat">
      <AiOutlineMessage />
      <h3>Your messages</h3>
      <p>Send private messages to a friend or a group.</p>
    </div>
  )
}
