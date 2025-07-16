import { PopupContext } from "@/context/PopupContext"
import { API_URL } from "@/services"
import { useContext, useEffect, useRef, useState } from "react"
import { User } from "@/types/user"
import PostHeader from "../post/postHeader"
import AboutProfileUser from "../profile/AboutProfileUser"
import Link from "next/link"

export  const SearchInput = ()=>{
    const popup = useContext(PopupContext)
        const [data , setData] = useState('')
    const [users , setUsers] = useState<User[]>([])
     const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const searchHandling = async ()=>{
        try {
            const res = await fetch(`${API_URL}api/v1/SearchProfile?message=${data}`, {
                method : 'GET',
                credentials : 'include'

            })
            if (!res.ok){
                throw new Error("Something went wrong");
            }
            const result = await res.json()
            console.log(result.message, '--------------------------result');
            
            setUsers(result.message)

            
        } catch (error : any) {
            popup?.showPopup("faild", error.message)
        }
    }
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Clear the previous timer
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set a new timer (e.g., 500ms after the user stops typing)
    typingTimeoutRef.current = setTimeout(() => {
      setData(value);
    }, 500);
  };
  useEffect(()=>{
     if (data !== '') {
      searchHandling();
    } 

    
  }, [data])
 return (
  <>
    <div className="Searching">
      <input
        type="text"
        placeholder="Search..."
        onChange={handleTyping}
      />

      {/* Wrap the results */}
      {users && users.length > 0 && (
        <div className="search-results">
          {users.map((user, index) => {
            if (!data) return null; 
            return (
              <Link key={index} href={`/profile/${user?.id}`} className="block">
                <div className="cursor-pointer">
                  {user?.avatar && (
                    <img
                      src={`http://localhost:8080/images/user/${user?.avatar}`}
                      alt={user?.nickname}
                      className="avatar-profile header-icon"
                    />
                  )}
                  <PostHeader
                    author={
                      user.nickname
                        ? user.nickname
                        : `${user.firstname}-${user.lastname}`
                    }
                    firstname={user.firstname}
                    lastname={user.lastname}
                    createdAt=""
                    avatarUrl={user.avatar}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  </>
);

}