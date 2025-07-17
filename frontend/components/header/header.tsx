"use client";
import Link from "next/link";
import { TiHome } from "react-icons/ti";
import { MdGroups2 } from "react-icons/md";
import { LuMessageCircleMore } from "react-icons/lu";
import { IoIosNotifications } from "react-icons/io";
import { usePathname } from "next/navigation";
import { IoIosLogOut } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { SocketContext, SocketContextType } from "@/context/socketContext";
import { GenerateAvatar } from "../profile/ProfileHeader";
import ToogleInitiale from "../request/ToogleInitiale";
import NotifToast from "@/utils/NotifToast";
import { SearchInput } from "../search/search";
import { CgProfile } from "react-icons/cg";
export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { ws, user, numsNotif, showNotif } = useContext(
    SocketContext
  ) as SocketContextType;

  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [showToggle, setShowToggle] = useState(false);
  const [clicked, setClicked] = useState<boolean>(false);

  useEffect(() => {
    if (["/login", "/register"].includes(pathname)) {
      setIsLogged(false);
    } else {
      setIsLogged(true);
    }
  }, [pathname]);

  const handleClickLogout = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/user/logout", {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        if (ws.current) {
          ws.current.close();
          setShowToggle(false);
        }
        setClicked(false);
        router.push("/login");
      }
    } catch (error) {
      if (ws.current) {
        ws.current.close();
      }
      setClicked(false);
      router.push("/login");
    }
  };
  const HandleToggle = () => {
    setShowToggle(!showToggle);
  };
  useEffect(() => {
    const handleClick = () => {
      if (showToggle) {
        setShowToggle(false);
      }
    };
    const main = document.querySelector("main");
    main?.addEventListener("click", handleClick);

    return () => {
      main?.removeEventListener("click", handleClick);
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
                <Link className="homeIcon" href={"/"}>
                  <TiHome className={pathname === "/" ? "active" : ""} />
                </Link>
              </li>
              <li>
                <Link className="chatIcon" href={"/chat/privateChat"}>
                  <LuMessageCircleMore
                    className={pathname.startsWith("/chat/") ? "active" : ""}
                  />
                </Link>
              </li>
              <li>
                <Link className="groupIcon" href={"/groups/joined"}>
                  <MdGroups2
                    className={
                      pathname.startsWith("/groups/")
                        ? "active groupIconHeader"
                        : "groupIconHeader"
                    }
                  />
                </Link>
              </li>
            </ul>

            <div className="header-icons">
              <SearchInput />
              <button
                className={`notification ${showToggle ? "active-not" : ""}`}
                onClick={HandleToggle}
                aria-label="Notifications"
              >
                <IoIosNotifications />
                <span>{numsNotif ? +numsNotif?.total : 0}</span>
              </button>

              <div className="profile-wrapper">
                <div
                  className="header-profile"
                  role="button"
                  tabIndex={0}
                  onBlur={() => setTimeout(() => setClicked(false), 100)}
                  onFocus={() => setClicked(true)}
                  aria-label="User profile"
                >
                  {user?.avatar ? (
                    <img
                      src={`http://localhost:8080/images/user/${user?.avatar}`}
                      alt={`${user?.firstname} ${user?.lastname}`}
                      className="avatar-profile header-icon"
                    />
                  ) : (
                    <div className="avatar-profile header-icon">
                      <h2>{GenerateAvatar(user?.firstname, user?.lastname)}</h2>
                    </div>
                  )}
                </div>

                {clicked && (
                  <div className="profile-dropdown">
                    <div
                      className="dropdown-item"
                      onMouseDown={() => {
                        setClicked(false);
                        router.push(`/profile/${user?.id}`);
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <CgProfile /> My Profile
                    </div>
                    <button
                      className="dropdown-item"
                      onMouseDown={handleClickLogout}
                    >
                      <IoIosLogOut /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </header>
      )}

      <ToogleInitiale showToggle={showToggle} setShowToggle={setShowToggle} />
      {showNotif && <NotifToast />}
    </>
  );
}
