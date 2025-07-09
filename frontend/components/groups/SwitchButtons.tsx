import React from 'react'

interface switchButtonsType {
    
}

function SwitchButtons() {
  return (
        <div className="switch-buttons">
          <Link
            href="/chat/privateChat"
            className={pathname.startsWith("/chat/privateChat") ? "active" : ""}
          >
            Private
          </Link>
          <Link
            href="/chat/groupsChat"
            className={pathname === "/chat/groupsChat" ? "active" : ""}
          >
            Groups
          </Link>
        </div>
  )
}

export default SwitchButtons