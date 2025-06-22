'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MdOutlineLaptopWindows } from "react-icons/md";
import { CiChat2 } from "react-icons/ci";
import { LiaNewspaperSolid } from "react-icons/lia";
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const handleLogin = async () => {
    setMessage(''); // clear previous messages

    try {
      const res = await fetch('http://localhost:8080/api/v1/user/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log(data, "data");


      if (res.ok) {
        setMessage('Login successful! Welcome back.');
        router.push("/")
        // You can add redirect logic here, e.g., router.push('/dashboard')
      } else {
        setMessage(data.Message || 'Login failed, please try again.');
      }
    } catch (error) {
      setMessage('Network error. Please try again later.');
    }
  };

  return (
    <div className="login-container">
      <section id='user-welcoming'>
        <div className="logo">
          Social <span>Net</span>work
        </div>
        <div className='user-community'>
          <div className='user-community-logo'>
            <MdOutlineLaptopWindows />
          </div>
          <div className='user-community-content'>
            <h1 className='user-community-title'> Community</h1>
            <p className='user-community-p'> Where connections grow and communities thrive.</p>
          </div>
        </div>
        <div className='user-chat'>
          <div className='user-chat-logo'>
            <CiChat2 />
          </div>
          <div className='user-chat-content'>
            <h1 className='user-chat-title'> Chat</h1>
            <p className='user-chat-p'>Conversations that bring people closer—instantly.</p>

          </div>
        </div>
        <div className='user-name'>
          <div className='user-name-logo'>
            <LiaNewspaperSolid />
          </div>
          <div className='user-name-content'>
            <h1 className='user-namelogo'> News</h1>
            <p className='user-name-p'>Share moments. Stay informed. Be heard.</p>
          </div>

        </div>


      </section>


      <section id='user-info'>
        <div id="user-welcom">
          <h1 className='user-welcom-title'>Welcome</h1>
          <p className='user-welcom-p'>Join gazillions of people online</p>
        </div>

        <div id="emailcontainer" className="user-input-group">
          <label htmlFor="email" className="user-sr-only">Email</label>
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
          <label htmlFor="password" className="user-sr-only">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={password}

            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <button onClick={handleLogin}>Login</button>
        </div>

        {message && <p className='user-message'>{message}</p>}
      </section>

    </div>
  );
}
