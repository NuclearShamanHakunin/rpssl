import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    CircularProgress,
    Alert,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
} from '@mui/material';


interface Highscore {
    username: string;
    wins: number;
    losses: number;
}

interface TokenData {
    username: string;
    user_type: 'USER' | 'ADMIN';
}

const decodeToken = (): TokenData | null => {
    const token = localStorage.getItem('token');
    if (!token) {
        return null;
    }
    try {
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = atob(payloadBase64);
        return JSON.parse(decodedPayload) as TokenData;
    } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
    }
};


const Leaderboard: React.FC = () => {
    const [scores, setScores] = useState<Highscore[]>([]);
    const [currentUser, setCurrentUser] = useState<TokenData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const fetchHighscores = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch('/rpssl/api/highscores');
            if (!response.ok) {
                throw new Error('Failed to fetch highscores.');
            }
            const data: Highscore[] = await response.json();
            setScores(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setCurrentUser(decodeToken());
        fetchHighscores();
    }, []);

    const handleReset = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('/rpssl/api/highscores/reset', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to reset leaderboard.');
            }

            fetchHighscores();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred during reset.');
        }
    };

    return (
        <Container component="main" maxWidth="md">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h4" gutterBottom>
                    Leaderboard
                </Typography>

                {currentUser?.user_type === 'ADMIN' && (
                    <Button variant="contained" color="error" onClick={handleReset} sx={{ mb: 2 }}>
                        Reset Leaderboard
                    </Button>
                )}

                {isLoading ? (
                    <CircularProgress sx={{ mt: 4 }} />
                ) : error ? (
                    <Alert severity="error" sx={{ width: '100%', mt: 4 }}>{error}</Alert>
                ) : (
                    <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                        <Table stickyHeader aria-label="leaderboard table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Rank</TableCell>
                                    <TableCell>Username</TableCell>
                                    <TableCell align="right">Wins</TableCell>
                                    <TableCell align="right">Losses</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {scores.map((score, index) => {
                                    const isCurrentUser = score.username === currentUser?.username;
                                    return (
                                        <TableRow
                                            key={score.username}
                                            sx={{
                                                backgroundColor: isCurrentUser ? 'action.hover' : 'inherit',
                                                '&:last-child td, &:last-child th': { border: 0 },
                                            }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell>{score.username}</TableCell>
                                            <TableCell align="right">{score.wins}</TableCell>
                                            <TableCell align="right">{score.losses}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </Container>
    );
};

export default Leaderboard;
