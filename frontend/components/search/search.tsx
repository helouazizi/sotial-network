import { PopupContext } from "@/context/PopupContext";
import { API_URL } from "@/services";
import { useContext, useEffect, useRef, useState } from "react";
import { User } from "@/types/user";
import PostHeader from "../post/postHeader";



export const SearchInput = () => {
  const popup = useContext(PopupContext);
  

  const [users, setUsers] = useState<User[]>([]);
  const [showResults, setShowResults] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const searchHandling = async (query: string) => {
    try {
      const res = await fetch(
        `${API_URL}api/v1/SearchProfile?message=${query}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Something went wrong");
      const result = await res.json();
      setUsers(result.message);
    } catch (error: any) {
      popup?.showPopup("faild", error.message);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (value.trim()) {
        setShowResults(true);
        searchHandling(value);
      } else {
        setShowResults(false);
        setUsers([]);
      }
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="Searching">
      <input type="text" placeholder="Search..." onChange={handleTyping} />

      {showResults && users.length > 0 && (
        <div className="search-results">
          {users.map((user) => (
            <div
              key={user.id}
              className="block cursor-pointer"
              onClick={() => {
                setShowResults(false);
                setTimeout(() => {
                  window.location.href = `/profile/${user.id}`;
                }, 50); // Optional short delay
              }}
            >
              {user.avatar && (
                <img
                  src={`${API_URL}images/user/${user.avatar}`}
                  alt={user.nickname}
                  className="avatar-profile header-icon"
                />
              )}
              <PostHeader
                author={user.nickname || `${user.firstname}-${user.lastname}`}
                firstname={user.firstname}
                lastname={user.lastname}
                createdAt=""
                avatarUrl={user.avatar}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
