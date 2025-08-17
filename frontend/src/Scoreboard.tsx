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
    Button
} from '@mui/material';

interface GameHistory {
    result: string;
}


interface TokenData {
    username: string;
    user_type: 'USER' | 'ADMIN';
}

const Scoreboard: React.FC = () => {
    const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [currentUser, setCurrentUser] = useState<TokenData | null>(null);

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

    const fetchGameHistory = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch('/api/gamehistory');
            if (!response.ok) {
                throw new Error('Failed to fetch game history.');
            }
            const data: GameHistory[] = await response.json();
            setGameHistory(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGameHistory();
        setCurrentUser(decodeToken());
    }, []);

    const handleReset = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('/api/gamehistory/reset', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to reset scoreboard.');
            }

            fetchGameHistory();
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
                    Scoreboard
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
                        <Table stickyHeader aria-label="scoreboard table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Game Result</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {gameHistory.map((game, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{game.result}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </Container>
    );
};

export default Scoreboard;
