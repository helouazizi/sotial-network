"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header>
      <nav>
        <Link href={"/"} className="logo">
          Social <span>Net</span>work
        </Link>
        <ul>
          <li>
            <Link href={"/"}><i className="fa-solid fa-house"></i></Link>
          </li> 
          <li>  
            <i className="fa-solid fa-user-group"></i>
          </li>
          <li>
            <Link href={"/chat"}><i className="fa-solid fa-message"></i></Link>
          </li>
        </ul>
        <div>
          <button className="notification"><i className="fa-solid fa-bell"></i></button>          
          <button className="profile"><i className="fa-solid fa-user"></i></button>
        </div>
      </nav>
    </header>
  );
}
