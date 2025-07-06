"use client";
import Link from "next/link";
import { TiHome } from "react-icons/ti";
import { MdGroups2 } from "react-icons/md";
import { LuMessageCircleMore } from "react-icons/lu";
import { IoIosNotifications } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { IoIosLogOut } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from "react";
import { SocketContext, SocketContextType } from "@/context/socketContext";
import { GenerateAvatar } from "../profile/ProfileHeader";
import ToogleInitiale from "../request/ToogleInitiale";
export default function Header() {
  const router = useRouter();
  const pathname = usePathname()
  const { ws, user } = useContext(SocketContext) as SocketContextType
  const [isLogged, setIsLogged] = useState<boolean>(false)
  const [showToggle, setShowToggle] = useState(false)

  useEffect(() => {
    if (["/login", "/register"].includes(pathname)) {
      setIsLogged(false)
    } else {
      setIsLogged(true)
    }
  }, [pathname])

  const handleClickLogout = async () => {
    try {
      const res = await fetch("http://localhost:8080/app/v1/user/logout", {
        method: 'GET',
        credentials: 'include',
      });

      if (res.ok) {
        if (ws.current) {
          ws.current.close()
        }
        router.push('/login')
      }

    } catch (error) {
      if (ws.current) {
        ws.current.close()
      }
      router.push('/login')
    }

  }
  const HandleToggle = () => {
    console.log("dss");

    setShowToggle(!showToggle)
    console.log(showToggle);

  }

  return (
    <>
      {isLogged && (
        <header>
          <nav>
            <Link href={"/"} className="logo">
              Social <span>Net</span>work
            </Link>
            <ul>
              <li>
                <Link href={"/"}><TiHome className={pathname === "/" ? "active" : " "} /></Link>
              </li>
              <li>
                <Link href={"/chat/privateChat"}><LuMessageCircleMore className={pathname.startsWith("/chat/") ? "active" : ""} /></Link>
              </li>
              <li>
                <Link href={"/groups"}><MdGroups2 className={pathname === "/groups" ? "active groupIconHeader" : "groupIconHeader"} /></Link>
              </li>
            </ul>
            <div className="header-icons">
              <button className={`notification ${showToggle ? "active-not" : ""}`} onClick={HandleToggle}><IoIosNotifications /></button>
              <Link href={`/profile/${user?.id}`}>
                {user?.avatar ? (
                  <img
                    src={`http://localhost:8080/images/user/${user?.avatar}`}
                    alt={`${user?.avatar}`}
                    className="avatar-profile header-icon"
                  />
                ) : (
                  <div className="avatar-profile header-icon"><h2>{GenerateAvatar(user?.firstName, user?.lastName)}</h2></div>
                )}
              </Link>

              <button className="user-logout" onClick={handleClickLogout} ><IoIosLogOut /></button>

            </div>

          </nav>
        </header>
      )}
      <ToogleInitiale showToggle={showToggle} setShowToggle={setShowToggle} />
    </>

  );
}
