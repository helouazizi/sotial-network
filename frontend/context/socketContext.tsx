"use client";
import { usePathname, useRouter } from "next/navigation";
import React, {
  createContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
  RefObject,
  useContext,
} from "react";
import { Message } from "../types/chat";
import { getUserInfos } from "@/services/user";
import { GroupNotifications, NumOfREquests } from "@/types/Request";
import { ProfileInt } from "@/types/profiles";
import { User } from "@/types/user";
import { PopupContext } from "./PopupContext";
import { Group, GrpMesage } from "@/types/groups";
export interface SocketContextType {
  ws: RefObject<WebSocket | null>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  friends: User[] | null;
  setFriends: React.Dispatch<React.SetStateAction<User[] | null>>;
  scrollHeight: boolean;
  setScrollHeight: React.Dispatch<React.SetStateAction<boolean>>;
  numsNotif: NumOfREquests | undefined;
  setNumNotif: React.Dispatch<React.SetStateAction<NumOfREquests | undefined>>;
  reqFollowers: ProfileInt[] | [];
  setReqFollowers: React.Dispatch<React.SetStateAction<ProfileInt[] | []>>;
  showNotif: boolean;
  setShowNotif: React.Dispatch<React.SetStateAction<boolean>>;
  messageNotif: string;
  setMessageNotif: React.Dispatch<React.SetStateAction<string>>;
  typeNotif: string;
  settypeNotif: React.Dispatch<React.SetStateAction<string>>;
  notifications: GroupNotifications[] | null
  setNotifications: React.Dispatch<React.SetStateAction<GroupNotifications[] | null>>;
  scrollToBottom: boolean
  setScrollToBottom: React.Dispatch<React.SetStateAction<boolean>>;
  currentGrp: Group | null
  setCurrentGrp: React.Dispatch<React.SetStateAction<Group | null>>
  msgGrp: GrpMesage[] | null
  setMsgGrp: React.Dispatch<React.SetStateAction<GrpMesage[] | null>>
  currentGrpRef: React.RefObject<Group | null>
}

export const SocketContext = createContext<SocketContextType | null>(null);

export default function SocketProvider({ children }: { children: ReactNode }) {
  const ws = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [friends, setFriends] = useState<User[] | null>(null);
  const [notifications, setNotifications] = useState<GroupNotifications[] | null>(null)
  const [scrollHeight, setScrollHeight] = useState<boolean>(false);
  const [scrollToBottom, setScrollToBottom] = useState<boolean>(false)
  const [numsNotif, setNumNotif] = useState<NumOfREquests | undefined>(undefined);
  const [reqFollowers, setReqFollowers] = useState<ProfileInt[] | []>([]);
  const [showNotif, setShowNotif] = useState(false);
  const [messageNotif, setMessageNotif] = useState("");
  const [typeNotif, settypeNotif] = useState("");
  const [currentGrp, setCurrentGrp] = useState<Group | null>(null)
  const [msgGrp, setMsgGrp] = useState<GrpMesage[] | null>(null)
  const currentGrpRef = useRef<Group | null>(null)
  const excludedPaths = ["/login", "/register"];
  const shouldConnect = !excludedPaths.includes(pathname);
  const popup = useContext(PopupContext);
  const router = useRouter();
  useEffect(() => {
    if (!shouldConnect) {
      return;
    }
    (async () => {
      const userRes = await getUserInfos();
      setUser(userRes);
    })();
    console.log("web socket open");
    ws.current = new WebSocket("ws://localhost:8080/ws");

    ws.current.onopen = () => {
      ws.current?.send(
        JSON.stringify({
          type: "GetNumNotif",
        })
      );
      ws.current?.send(JSON.stringify({ type: "GetFollowersRequest" }));
    };

    ws.current.onmessage = (event: MessageEvent) => {
      let res = JSON.parse(event.data);


      if (res.type === "CountNotifs") {
        const countotifs: NumOfREquests = {
          followersCount: res.data.followersCount,
          groupeReqCount: res.data.groupeCount,
          total: res.data.total,
        };
        setNumNotif(countotifs);
      }
      if (res.type === "requestsFollowers") {
        setReqFollowers((prev) => {
          if (!prev || !res.data) return [];
          return [...res.data];
        });
      }
      if (res.type == "showNotif") {
        setMessageNotif(res.message);
        settypeNotif("Follow");
        setShowNotif(true);
      }

      if (res.type == "NotMemberInGrp") {
        popup?.showPopup('faild', res.text)
        router.push("/chat/groupsChat")
      }

      if (res.type === "getMessages") {
        if (res.data) {
          let reverseData = res.data.reverse();
          setMessages((prev) => [...reverseData, ...prev]);
        } else {
          setMessages((prev) => [...[], ...prev]);
        }

        setScrollHeight((prev) => !prev);
      }

      if (res.type === "saveMessage") {
        setMessages(prev => [...prev ?? [], res.message])
        setScrollToBottom(prev => !prev)
      }
      if (res.type === "ResponseRequestsFollowers") {
        setNumNotif((prev) => {
          if (!prev || typeof prev.followersCount !== "number") return prev;
          return {
            ...prev,
            followersCount:
              prev.followersCount > 0 ? +prev.followersCount - 1 : 0,
            total: +prev.total > 0 ? +prev.total - 1 : 0,
          };
        });
        setReqFollowers((prev) => {
          return prev.filter((ele) => ele.request_id !== res.ReqID);
        });
      }
      if (res.type === "eventNotification") {
        setMessageNotif(res.data);
        settypeNotif("Event");
        setShowNotif(true);
      }
      if (res.type === "showNotifMsg") {
        popup?.showPopup("success", `New message from ${res.message}`)

      }
      if (res.type === "GroupRequestsError") {
        if (res.error) {
          popup?.showPopup("faild", res.error)
        }
      }

      if (res.type === "groupRequests") {
        setNotifications(res.data)
      }
      if (res.type == "newGroupSelected") {
        const selectedGroup: Group = res.data;
        setCurrentGrp(selectedGroup);
        currentGrpRef.current = selectedGroup
      }

      if (res.type == "NewMsgGrp") {
        let message = res.message;
        if (message?.group_id == currentGrpRef?.current?.id) {
          setMsgGrp((prev) => {
            if (!prev) return [message]
            return [...prev, message]
          })
        }
      };

      if (res.type == "NewMemberJoined") {
        if (currentGrpRef?.current?.id == res.grp_id) {
          const stringifiedMembers = res.newMembers.map(String);
          setCurrentGrp((prev) => {
            if (!prev) return null
            return {
              ...prev,
              members: stringifiedMembers,
              count_members: prev.count_members + 1

            }
          })
        }
      }
    }

    ws.current.onclose = () => {
      console.log("web socket closed");
    };

    return () => ws.current?.close();
  }, [shouldConnect]);

  return (
    <SocketContext.Provider
      value={{
        ws,
        messages,
        setMessages,
        user,
        setUser,
        friends,
        setFriends,
        scrollHeight,
        setScrollHeight,
        numsNotif,
        setNumNotif,
        reqFollowers,
        setReqFollowers,
        messageNotif,
        setMessageNotif,
        showNotif,
        setShowNotif,
        typeNotif,
        settypeNotif,
        notifications,
        setNotifications,
        scrollToBottom,
        setScrollToBottom,
        currentGrp,
        setCurrentGrp,
        msgGrp,
        setMsgGrp,
        currentGrpRef
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
