import React, { useState, useEffect } from 'react';

const Profile = () => {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            const response = await fetch('/profile');
            const data = await response.json();
            if (response.ok) {
                setUsername(data.username);
            } else {
                setMessage(data.msg);
                window.location.href = '/login';
            }
        };
        fetchProfile();
    }, []);

    const handleLogout = async () => {
        await fetch('/logout');
        window.location.href = '/login';
    };

    if (message) {
        return <p>{message}</p>;
    }

    return (
        <div>
            <h2>Welcome, {username}</h2>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Profile;
