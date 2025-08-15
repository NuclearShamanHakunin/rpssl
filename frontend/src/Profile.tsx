import React, { useState, useEffect } from 'react';

const Profile = () => {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch('/profile', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.username) {
                    setUsername(data.username);
                } else {
                    setMessage(data.detail);
                    window.location.href = '/login';
                }
            });
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
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
