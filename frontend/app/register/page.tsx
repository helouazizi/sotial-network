'use client';
import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Welcomingmessage from '../components/Auth/welcomingMessage';

export default function Register() {
    const [lastname, setLastname] = useState<string>('');
    const [firstname, setFirstName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [username, setUser] = useState<string>('');
    const [avatar, setAvatar] = useState<File | null>(null);
    const [DOB, setDOB] = useState<string>('');
    const [about, setaboutme] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const router = useRouter();

const HandleRegister = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setMessage('');

    const formData = new FormData();
    formData.append('nickname', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('firstname', firstname);
    formData.append('lastname', lastname);
    formData.append('dateofbirth', DOB);
    formData.append('aboutme', about);

    if (avatar) {
        formData.append('avatar', avatar);
    }

    try {
        const res = await fetch('http://localhost:8080/api/v1/user/register', {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });

        const data = await res.json();

        if (res.ok) {
            router.push('/');
            setMessage('Registration successful!');
        } else {
            setMessage(data.message || 'Registration failed, please try again.');
        }
    } catch (error) {
        setMessage('Network error. Please try again later.');
    }
};


    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setAvatar(e.target.files[0]);
        }
    };

    return (
        <section id='user-main'>
            <section className="register-form">
                <form>
                    <div className="names">
                        <div className="firstname">
                            <h1>First Name</h1>
                            <input
                                type="text"
                                id="first-name"
                                value={firstname}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="lastname">
                            <h1>Last Name</h1>
                            <input
                                type="text"
                                id="last-name"
                                value={lastname}
                                onChange={(e) => setLastname(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="credential">
                        <div className="email">
                            <h1>Email:</h1>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="password">
                            <h1>Password:</h1>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="opt">
                        <div className="username">
                            <h1>Username:</h1>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUser(e.target.value)}
                            />
                        </div>
                        <div className="profile">
                            <h1>Avatar:</h1>
                            <input
                                type="file"
                                id="avatar"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>

                    <div className="dob-about">
                        <div className="dob">
                            <h1>Date of Birth:</h1>
                            <input
                                type="date"
                                id="dob"
                                value={DOB}
                                onChange={(e) => setDOB(e.target.value)}
                            />
                        </div>
                        <div className="aboutme">
                            <h1>About Me:</h1>
                            <input
                                type="text"
                                id="about"


                                value={about}
                                onChange={(e) => setaboutme(e.target.value)}
                            />
                        </div>
                    </div>

                    <button type="button" onClick={HandleRegister}>Register</button>
                </form>

                {message && <p>{message}</p>}
            </section>
            <Welcomingmessage />

        </section>

    );
}
