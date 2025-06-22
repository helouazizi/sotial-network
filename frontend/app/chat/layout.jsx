import { FaUser } from "react-icons/fa";
import ChatNav from "../components/chat/chatNav";
import ChatFooter from "../components/chat/chatFooter";

export default function ChatLayout({ children }) {
  return (
    <main className="container chatPage">
      <section className="sidebar">
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
      <section className="chatMessages">
        <div className="chatHeader">
          <p className="userName"><FaUser /> Youssef</p>
          <p className="online"><span></span> online</p>
        </div>
        <div className="chatBody">

          <div className="sender">
            <p>ana sender</p>
          </div>
          <div className="receiver">
            <p>ana receiver</p>
          </div>
           <div className="sender">
            <p>ana sender</p>
          </div>
          <div className="receiver">
            <p>ana receiver</p>
          </div>
           <div className="sender">
            <p>ana sender</p>
          </div>
          <div className="receiver">
            <p>ana receiver</p>
          </div>  
        </div>
        <ChatFooter />
      </section>
      <section className="suggestionGroups">
        
      </section>
    </main>
  );
}
