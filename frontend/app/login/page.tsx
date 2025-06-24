"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import Welcomingmessage from "../components/Auth/welcomingMessage";
import { SocketContext, SocketContextType } from "../context/socketContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { ws } = useContext(SocketContext) as SocketContextType

  const handleLogin = async () => {
    setMessage(""); // clear previous messages

    try {
      const res = await fetch("http://localhost:8080/api/v1/user/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log(data, "data");

      if (res.ok) {
        router.push("/");
        // You can add redirect logic here, e.g., router.push('/dashboard')
      } else {
        setMessage(data.Message || "Login failed, please try again.");
      }
    } catch (error) {
      setMessage("Network error. Please try again later.");
    }
  };

  const handlerClickWebSocket = () => {
    console.log(ws.current);
  };

  return (
    <div className="login-container">
      <Welcomingmessage />

      <section id="user-info">
        <div id="user-welcom">
          <h1 className="user-welcom-title">Welcome</h1>
          <p className="user-welcom-p">Join gazillions of people online</p>
        </div>

        <div id="emailcontainer" className="user-input-group">
          <label htmlFor="email" className="user-sr-only">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div id="passwordcontainer" className="user-input-group">
          <label htmlFor="password" className="user-sr-only">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-buttons">
          <button type="button" onClick={handleLogin}>
            Login
          </button>
        </div>
        <div className="user-account">
          <p className="user-account-content">you don't have an account? :</p>
          <button
            className="user-account-button"
            onClick={() => router.push("/register")}
          >
            {" "}
            Register
          </button>
        </div>

        {message && <p className="user-message">{message}</p>}

        <button onClick={handlerClickWebSocket}>Send to web socket</button>
      </section>
    </div>
  );
}
