import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography, Alert} from '@mui/material';
import { useNavigate } from 'react-router-dom';


const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (isLogin) {
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);

            try {
                const response = await fetch('/rpssl/api/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formData,
                });
                const data = await response.json();
                if (response.ok) {
                    localStorage.setItem('token', data.access_token);
                    navigate('/profile');
                } else {
                    setError(data.detail || 'Login failed. Please check your credentials.');
                }
            } catch (err) {
                setError('An error occurred. Please try again later.');
            }
        } else {
            try {
                const response = await fetch('/rpssl/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });
                const data = await response.json();
                if (response.ok) {
                    setMessage(data.msg || 'Registration successful! Please log in.');
                    setIsLogin(true);
                } else {
                    setError(data.detail || 'Registration failed.');
                }
            } catch (err) {
                setError('An error occurred during registration.');
            }
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    {isLogin ? 'Sign in' : 'Register'}
                </Typography>

                {message && <Alert severity="success" sx={{ width: '100%', mt: 2 }}>{message}</Alert>}
                {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {isLogin ? 'Sign In' : 'Register'}
                    </Button>
                    <Button
                        fullWidth
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                            setMessage('');
                        }}
                    >
                        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;
