"use client"
import { PopupContext } from "@/context/PopupContext";
import { GetGroups, groupType } from "@/services/groupServices";
import { Group } from "@/types/groups";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { MdGroups } from "react-icons/md";

export default function GroupsChat() {
  const [joinedGrpChat, setJoinedGrpChat] = useState<Group[] | null>(null)
  const popup = useContext(PopupContext)
  const pathName = usePathname()
  useEffect(() => {
    const fetchGroups = async () => {
      const data = await GetGroups("getJoined")
      if (data && data.error) {
        popup?.showPopup("faild", "Ooops, something wrong!!")
        return
      }
      setJoinedGrpChat(data)
    }
    fetchGroups()
  }, [])

  const displayGroups = () => {
    return joinedGrpChat?.map((group, index) => {
      let title = group.title.length > 25 ? group.title.slice(0, 25).trim() + "..." : group.title
      let path = pathName.startsWith("/chat/groupsChat") ? "/chat/groupsChat/" + group.id : ""

      return (
        <li key={index}>
          <Link href={path}><span><MdGroups /></span> <p>{title}</p></Link>
        </li>
      )
    })
  }
  return (
    <>
      {displayGroups()}
    </>
  );
}
