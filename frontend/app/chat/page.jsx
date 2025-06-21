import { FaUser } from "react-icons/fa";

export default function Chat() {
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
            <li>Youssef</li>
            <li>Ahmed</li>
            <li>Smail</li>
            <li>Hassan</li>
            <li>Mohammed</li>
            <li>Adnane</li>
            <li>Mustafa</li>
            <li>Youssef</li>
            <li>Ahmed</li>
            <li>Smail</li>
            <li>Hassan</li>
            <li>Mohammed</li>
            <li>Adnane</li>
            <li>Mustafa</li>
          </ul>
        </div>
      </section>
      <section className="chat"></section>
    </main>
  );
}
