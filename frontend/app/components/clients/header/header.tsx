"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  return (
    <header>
      <nav>
        <Link href={"/"} className="logo">
          Social <span>Net</span>work
        </Link>
        <ul>
          <li>
            <i className="fa-solid fa-house"></i>
          </li>
          <li>
            <i className="fa-solid fa-user-group"></i>
          </li>
          <li>
            <i className="fa-solid fa-message"></i>
          </li>
        </ul>
        <div>
          <button className="notification"><i className="fa-solid fa-envelope"></i></button>          
          <button className="profile"><i className="fa-solid fa-user"></i></button>
        </div>
      </nav>
    </header>
  );
}
