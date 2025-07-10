"use client";
import Link from "next/link";
import { TiHome } from "react-icons/ti";
import { MdGroups2 } from "react-icons/md";
import { LuMessageCircleMore } from "react-icons/lu";
import { IoIosNotifications } from "react-icons/io";
import { usePathname } from "next/navigation";
import { IoIosLogOut } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from "react";
import { SocketContext, SocketContextType } from "@/context/socketContext";
import { GenerateAvatar } from "../profile/ProfileHeader";
import ToogleInitiale from "../request/ToogleInitiale";
import NotifToast from "@/utils/NotifToast";
export default function Header() {


  const router = useRouter();
  const pathname = usePathname();
  const { ws, user, numsNotif, showNotif, setShowNotif } = useContext(SocketContext) as SocketContextType

  const [isLogged, setIsLogged] = useState<boolean>(false)
  const [showToggle, setShowToggle] = useState(false)

  useEffect(() => {
    if (["/login", "/register"].includes(pathname)) {
      setIsLogged(false)
    } else {
      setIsLogged(true)
    }
  }, [pathname])
  useEffect(() => {
    let a = setInterval(() => {
      setShowNotif(false)
    }, 5000)
    return () => (clearInterval(a))
  }, [showNotif])
  const handleClickLogout = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/user/logout", {
        method: 'GET',
        credentials: 'include',
      });

      if (res.ok) {
        if (ws.current) {
          ws.current.close()
          setShowToggle(false)
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
    setShowToggle(!showToggle)
  }
  useEffect(() => {
    const handleClick = () => {
      if (showToggle) {
        setShowToggle(false);
      }
    };
    const main = document.querySelector('main');
    main?.addEventListener('click', handleClick);

    return () => {
      main?.removeEventListener('click', handleClick);
    };
  }, [showToggle]);
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
                <Link href={"/groups/joined"}><MdGroups2 className={pathname.startsWith("/groups/") ? "active groupIconHeader" : "groupIconHeader"} /></Link>
              </li>
            </ul>
            <div className="header-icons">
              <button className={`notification ${showToggle ? "active-not" : ""}`} onClick={HandleToggle}><IoIosNotifications /> <span>{numsNotif ? +(numsNotif?.total) : 0}</span></button>
              <Link href={`/profile/${user?.id}`}>
                {user?.avatar ? (
                  <img
                    src={`http://localhost:8080/images/user/${user?.avatar}`}
                    alt={`${user?.avatar}`}
                    className="avatar-profile header-icon"
                  />
                ) : (
                  <div className="avatar-profile header-icon"><h2>{GenerateAvatar(user?.firstname, user?.lastname)}</h2></div>
                )}
              </Link>

              <button className="user-logout" onClick={handleClickLogout} ><IoIosLogOut /></button>

            </div>

          </nav>
        </header>
      )}
      <ToogleInitiale showToggle={showToggle} setShowToggle={setShowToggle} />
      {showNotif && <NotifToast />}

    </>

  );
}
