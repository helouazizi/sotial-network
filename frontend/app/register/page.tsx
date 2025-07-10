'use client';
import { useState, ChangeEvent } from 'react';
import React from 'react'

import { useRouter } from 'next/navigation';
import Welcomingmessage from '../../components/Auth/welcomingMessage';

export default function Register() {
    const [lastname, setLastName] = useState<string>('');
    const [firstname, setFirstName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [username, setUser] = useState<string>('');
    const [avatar, setAvatar] = useState<File | null>(null);
    const [DOB, setDOB] = useState<string>('');
    const [about, setAboutme] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const router = useRouter();

    // Error states
    const [nicknameErr, setNicknameErr] = useState<string>('');
    const [emailErr, setEmailErr] = useState<string>('');
    const [passwordErr, setPasswordErr] = useState<string>('');
    const [firstnameErr, setFirstnameErr] = useState<string>('');
    const [lastnameErr, setLastnameErr] = useState<string>('');
    const [dobErr, setDobErr] = useState<string>('');
    const [aboutmeErr, setAboutmeErr] = useState<string>('');

    const HandleRegister = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setMessage('');

        // Reset error states
        setNicknameErr('');
        setEmailErr('');
        setPasswordErr('');
        setFirstnameErr('');
        setLastnameErr('');
        setDobErr('');
        setAboutmeErr('');

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
            console.log(data, 'data');


            if (res.ok) {

                router.push('/');
            } else {
                if (data.UserErrors.HasErro) {
                    setNicknameErr(data.UserErrors.Nickname);
                    setEmailErr(data.UserErrors.Email);
                    setPasswordErr(data.UserErrors.PassWord);
                    setFirstnameErr(data.UserErrors.FirstName);
                    setLastnameErr(data.UserErrors.LastName);
                    setDobErr(data.UserErrors.DateofBirth);
                    setAboutmeErr(data.UserErrors.AboutMe);
                }
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
                                placeholder='Enter your First Name'
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            {firstnameErr && <p className='user-error'>{firstnameErr}</p>}
                        </div>
                        <div className="lastname">
                            <h1>Last Name</h1>
                            <input
                                type="text"
                                id="last-name"
                                value={lastname}
                                placeholder='Enter your Last Name'
                                onChange={(e) => setLastName(e.target.value)}
                            />
                            {lastnameErr && <p className='user-error'>{lastnameErr}</p>}
                        </div>
                    </div>

                    <div className="credential">
                        <div className="email">
                            <h1>Email:</h1>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                placeholder='Enter your Email'
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {emailErr && <p className='user-error'>{emailErr}</p>}
                        </div>
                        <div className="password">
                            <h1>Password:</h1>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                placeholder='Enter your Password'
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {passwordErr && <p className='user-error'>{passwordErr}</p>}
                        </div>
                    </div>

                    <div className="opt">
                        <div className="username">
                            <h1>nickname:</h1>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                placeholder='Enter your Nickname '
                                onChange={(e) => setUser(e.target.value)}
                            />
                            {nicknameErr && <p className='user-error'>{nicknameErr}</p>}
                        </div>
                        <div className="user-avatar">
                            <h1 className='user-avatar-title'>Avatar:</h1>
                            <label htmlFor="avatar" className="custom-file-upload">
                                {avatar ? avatar.name : "Choose Avatar"}
                            </label>
                            <input
                                className='user-avatar-content'
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
                            {dobErr && <p className='user-error'>{dobErr}</p>}
                        </div>
                        <div className="aboutme">
                            <h1>About Me:</h1>
                            <input
                                type="text"
                                id="about"
                                value={about}
                                placeholder='Enter semmething'
                                onChange={(e) => setAboutme(e.target.value)}
                            />
                            {aboutmeErr && <p className='user-error'>{aboutmeErr}</p>}
                        </div>
                    </div>

                    <div className="form-buttons">

                        <button type="button" onClick={HandleRegister}>Register</button>
                    </div>

                </form>

                {message && <p className='user-error'>{message}</p>}
                <div className='user-account'>
                    <p className='user-account-content'>Alrady have an account? :</p>
                    <button className='user-account-button' onClick={() => router.push("/login")}> Login</button>
                </div>

            </section>
            <Welcomingmessage />


        </section>
    );
}
