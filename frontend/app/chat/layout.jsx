import { FaUser } from "react-icons/fa";
import ChatNav from "../components/chat/chatNav";

export default function ChatLayout({ children }) {
  return (
    <main className="container chatPage">
      <section>
        <div className="myName">
          <p>
            <FaUser /> Africano
          </p>
        </div>
        <div className="friends">
          <ChatNav />
          <div className="friends-list">
            <ul>{children}</ul>
          </div>
        </div>
      </section>
      <section className="chatMessages"></section>
    </main>
  );
}
