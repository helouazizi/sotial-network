'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';
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
      {/* Your existing JSX */}

      <section>
        <div id="welcom">
          <h1>Welcome</h1>
          <p>Something here</p>
        </div>

        <div id="emailcontainer" className="input-group">
          <label htmlFor="email" className="sr-only">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div id="passwordcontainer" className="input-group">
          <label htmlFor="password" className="sr-only">Password</label>
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

        {message && <p>{message}</p>}
      </section>
    </div>
  );
}
