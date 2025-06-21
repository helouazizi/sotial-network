import { FaUser } from "react-icons/fa";

export default function ChatLayout({children}) {
    return (
        <main className="container chatPage">
      <section>
        <div className="myName">
          <p>
            <FaUser /> Africano
          </p>
        </div>
        <div className="friends">
          <div className="type">
            <button>Private</button>
            <button>Groups</button>
          </div>
          <ul>
            {children}
          </ul>
        </div>
      </section>
      <section className="chat"></section>
    </main>
    )
}