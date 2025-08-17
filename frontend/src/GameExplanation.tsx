import React, { useState, useEffect } from 'react';
import { 
    Container, 
    Box, 
    Typography, 
    CircularProgress, 
    Alert, 
    Paper, 
    Grid 
} from '@mui/material';


interface Choice {
    id: number;
    name: string;
}

enum GameResult {
    TIE,
    LOSE,
    WIN,
}

const choiceImages: { [key: string]: string } = {
    rock: '/resources/rock.png',
    paper: '/resources/paper.png',
    scissors: '/resources/scissors.png',
    lizard: '/resources/lizard.png',
    spock: '/resources/spock.png',
};

const GAME_LOGIC: GameResult[][] = [
    [GameResult.TIE, GameResult.LOSE, GameResult.WIN,  GameResult.WIN,  GameResult.LOSE],
    [GameResult.WIN, GameResult.TIE,  GameResult.LOSE, GameResult.LOSE, GameResult.WIN ],
    [GameResult.LOSE,GameResult.WIN,  GameResult.TIE,  GameResult.WIN,  GameResult.LOSE],
    [GameResult.LOSE,GameResult.WIN,  GameResult.LOSE, GameResult.TIE,  GameResult.WIN ],
    [GameResult.WIN, GameResult.LOSE, GameResult.WIN,  GameResult.LOSE, GameResult.TIE ]
];

const GameExplanation: React.FC = () => {
    const [choices, setChoices] = useState<Choice[]>([]);
    const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchChoices = async () => {
            try {
                const response = await fetch('/rpssl/api/choices');
                if (!response.ok) {
                    throw new Error('Failed to fetch game choices from the server.');
                }
                const data: Choice[] = await response.json();
                setChoices(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchChoices();
    }, []);

    const getInteractionStyle = (itemChoice: Choice) => {
        if (!selectedChoice) {
            return {};
        }
        if (itemChoice.id === selectedChoice.id) {
            return {
                transform: 'scale(1.1)',
                boxShadow: '0 0 15px 5px #868686ff',
                zIndex: 10,
            };
        }

        const result = GAME_LOGIC[selectedChoice.id][itemChoice.id];
        switch (result) {
            case GameResult.WIN:
                return { boxShadow: '0 0 15px 5px #4caf50' };
            case GameResult.LOSE:
                return { boxShadow: '0 0 15px 5px #f44336' };
        }
    };

    return (
        <Container component="main" maxWidth="lg">
            <Box sx={{ marginTop: 8, textAlign: 'center' }}>
                {isLoading ? (
                    <CircularProgress sx={{ mt: 4 }} />
                ) : error ? (
                    <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
                ) : (
                    <Grid container spacing={4} justifyContent="center" onMouseLeave={() => setSelectedChoice(null)}>
                        {choices.map((choice) => (
                            <Grid key={choice.id}>
                                <Paper
                                    elevation={3}
                                    onMouseEnter={() => setSelectedChoice(choice)}
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        textAlign: 'center',
                                        transition: 'all 0.3s ease-in-out',
                                        ...getInteractionStyle(choice),
                                    }}
                                >
                                    <img
                                        src={choiceImages[choice.name.toLowerCase()]}
                                        alt={choice.name}
                                        style={{ width: 120, height: 120, objectFit: 'scale-down' }}
                                    />
                                    <Typography variant="h6" sx={{ mt: 1, textTransform: 'capitalize' }}>
                                        {choice.name}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </Container>
    );
};

export default GameExplanation;