import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
    const [username, setUsername] = useState<string | null>(null);
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch('/api/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setUsername(data.username);
                } else {
                    setError(data.detail || 'Failed to fetch profile. Please log in again.');
                    localStorage.removeItem('token');
                    setTimeout(() => navigate('/login'), 3000);
                }
            } catch (err) {
                setError('An error occurred. Please check your connection.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);


    return (
        <Container component="main" maxWidth="md">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                }}
            >
                {isLoading ? (
                    <CircularProgress />
                ) : error ? (
                    <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>
                ) : (
                    <>
                        <Typography component="h1" variant="h4" gutterBottom>
                            Welcome, {username}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                            This is your protected profile page.
                        </Typography>
                    </>
                )}
            </Box>
        </Container>
    );
};

export default Profile;
