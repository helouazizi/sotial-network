"use client";
import Link from "next/link";
import { TiHome } from "react-icons/ti";
import { MdGroups2 } from "react-icons/md";
import { LuMessageCircleMore } from "react-icons/lu";
import { IoIosNotifications } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname()
  
  return (
    <header>
      <nav>
        <Link href={"/"} className="logo">
          Social <span>Net</span>work
        </Link>
        <ul>
          <li>
            <Link href={"/"}><TiHome className={pathname === "/" ? "active" : " "}/></Link>
          </li> 
          <li>  
            <Link href={"/chat/groups"}><MdGroups2 className="groupIconHeader" /></Link>
          </li>
          <li>
            <Link href={"/chat/privateChat"}><LuMessageCircleMore  className={pathname === "/chat" ? "active" : ""}/></Link>
          </li>
        </ul>
        <div>
          <button className="notification"><IoIosNotifications /></button>          
          <button className="profile"><FaUser /></button>
        </div>
      </nav>
    </header>
  );
}
