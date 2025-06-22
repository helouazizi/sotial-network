"use client"
import { useEffect, useRef } from "react";
import { FaUser } from "react-icons/fa";

export default function PrivateChat() {
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080/ws")

    ws.current.onopen = () => {
      console.log("web socket open")
    }

    ws.current.onclose = () => {
      console.log("web socket closed")
    }

    ws.current.onmessage = (event) => {
       const newMsg = JSON.parse(event.data);
       console.log(newMsg)
    }


    return () => ws.current.close()
  }, [])

  const handleClick = () => {
    ws.current.send(JSON.stringify({"message": "hello world", "sender_id": 4, "receiver_id": 1 }))
  }

  return (
    <>
      <li>
        <FaUser /> Youssef
      </li>
      <li>
        <FaUser /> Ahmed
      </li>
      <li>
        <FaUser /> Smail
      </li>
      <li>
        <FaUser /> Hassan
      </li>
      <li><FaUser /> Mohammed</li>
      <li><FaUser /> Mohammed</li>
      <li><FaUser /> Mohammed</li>


    <button onClick={handleClick}>send</button>
    </>
  );
}
