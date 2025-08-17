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
} from '@mui/material';

interface GameHistory {
    result: string;
}

const Scoreboard: React.FC = () => {
    const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
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

        fetchGameHistory();
    }, []);

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
