import { SocketContext, SocketContextType } from "@/context/socketContext";
import React, { useContext, useEffect } from "react";
import { FaRegCircleCheck } from "react-icons/fa6";

const NotifToast = () => {
  const { messageNotif, typeNotif, showNotif, setShowNotif } = useContext(
    SocketContext
  ) as SocketContextType;
  useEffect(() => {
    setTimeout(() => {
      console.log("a", showNotif);
      setShowNotif(false);
      console.log("b", showNotif);
    }, 5000);
  }, [showNotif]);

  return (
    <div className="NotifToast">
      <FaRegCircleCheck />
      <div>
        <h3>
          New <strong>{typeNotif}</strong> request.
        </h3>
        <p>{messageNotif}</p>
      </div>
    </div>
  );
};

export default NotifToast;
