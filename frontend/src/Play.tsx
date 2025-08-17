import React, { useState, useEffect } from 'react';
import { 
    Container, 
    Box, 
    Typography, 
    CircularProgress, 
    Alert, 
    Paper, 
    Grid, 
    Button, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle,
    Backdrop
} from '@mui/material';


interface Choice {
    id: number;
    name: string;
}

interface GameResult {
    results: 'win' | 'lose' | 'tie';
    player: number;
    computer: number;
}

const choiceImages: { [key: string]: string } = {
    rock: 'resources/rock.png',
    paper: 'resources/paper.png',
    scissors: 'resources/scissors.png',
    lizard: 'resources/lizard.png',
    spock: 'resources/spock.png',
};

const Play: React.FC = () => {
    const [choices, setChoices] = useState<Choice[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [hint, setHint] = useState<Choice | null>(null);
    const [isHintModalOpen, setIsHintModalOpen] = useState<boolean>(false);
    const [isHintLoading, setIsHintLoading] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [gameResult, setGameResult] = useState<GameResult | null>(null);
    const [isResultModalOpen, setIsResultModalOpen] = useState<boolean>(false);


    useEffect(() => {
        const fetchChoices = async () => {
            try {
                const response = await fetch('/rpssl/api/choices');
                if (!response.ok) {
                    throw new Error('Failed to fetch choices from the server.');
                }
                const data: Choice[] = await response.json();
                setChoices(data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchChoices();
    }, []);

    const handleChoiceClick = async (choiceId: number) => {
        setIsPlaying(true);
        setError('');

        try {
            const response = await fetch('/rpssl/api/play', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ player: choiceId }),
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'The server failed to process the game round.');
            }

            const resultData: GameResult = await response.json();
            setGameResult(resultData);
            setIsResultModalOpen(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred while playing.');
        } finally {
            setIsPlaying(false);
        }
    };

    const handleHintClick = async () => {
        setIsHintLoading(true);
        try {
            const response = await fetch('/rpssl/api/choice');
            if (!response.ok) {
                throw new Error('Could not get a hint from the server.');
            }
            const data: Choice = await response.json();
            setHint(data);
            setIsHintModalOpen(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred while fetching hint.');
        } finally {
            setIsHintLoading(false);
        }
    };

    const handleCloseHintModal = () => {
        setIsHintModalOpen(false);
    };

    const handleCloseResultModal = () => {
        setIsResultModalOpen(false);
        setGameResult(null);
    };

    const getChoiceById = (id: number): Choice | undefined => choices.find(c => c.id === id);

    const renderResultContent = () => {
        if (!gameResult) return null;

        const playerChoice = getChoiceById(gameResult.player);
        const computerChoice = getChoiceById(gameResult.computer);
        const resultText = {
            win: '🎉 You Win! 🎉',
            lose: '😢 You Lose 😢',
            tie: '🤝 It\'s a Tie! 🤝'
        }[gameResult.results];
        
        if (!playerChoice || !computerChoice) {
            return <Alert severity="error">Could not display results. Data is missing.</Alert>;
        }

        return (
             <Box>
                <Typography variant="h4" component="h2" gutterBottom align="center">
                    {resultText}
                </Typography>
                <Grid container spacing={2} justifyContent="center" alignItems="center">
                    <Grid textAlign="center">
                        <Typography variant="h6">You Chose</Typography>
                        <Paper elevation={3} sx={{ p: 2, display: 'inline-block' }}>
                            <img src={choiceImages[playerChoice.name.toLowerCase()]} alt={playerChoice.name} style={{ width: 120, height: 120 }} />
                            <Typography variant="body1" sx={{textTransform: 'capitalize'}}>{playerChoice.name}</Typography>
                        </Paper>
                    </Grid>
                    <Grid textAlign="center">
                        <Typography variant="h4">VS</Typography>
                    </Grid>
                    <Grid textAlign="center">
                        <Typography variant="h6">Computer Chose</Typography>
                         <Paper elevation={3} sx={{ p: 2, display: 'inline-block' }}>
                            <img src={choiceImages[computerChoice.name.toLowerCase()]} alt={computerChoice.name} style={{ width: 120, height: 120 }} />
                            <Typography variant="body1" sx={{textTransform: 'capitalize'}}>{computerChoice.name}</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        );
    };


    return (
        <Container component="main" maxWidth="lg">
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isPlaying}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                }}
            >
                <Typography component="h1" variant="h4" gutterBottom>
                    Play against computer opponent
                </Typography>

                <Button variant="outlined" onClick={handleHintClick} sx={{ mb: 2 }} disabled={isHintLoading}>
                    {isHintLoading ? <CircularProgress size={24} /> : 'Get a Hint'}
                </Button>

                {isLoading ? (
                    <CircularProgress sx={{ mt: 4 }} />
                ) : error ? (
                    <Alert severity="error" sx={{ width: '100%', mt: 4 }}>{error}</Alert>
                ) : (
                    <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>
                        {choices.map((choice) => (
                            <Grid key={choice.id}>
                                <Paper
                                    elevation={3}
                                    onClick={() => handleChoiceClick(choice.id)}
                                    sx={{
                                        p: 1,
                                        borderRadius: 2,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow: 6,
                                        },
                                    }}
                                >
                                    <img
                                        src={choiceImages[choice.name.toLowerCase()]}
                                        alt={choice.name}
                                        style={{ width: 120, height: 120, objectFit: 'scale-down', borderRadius: '4px' }}
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

            <Dialog open={isResultModalOpen} onClose={handleCloseResultModal} maxWidth="sm" fullWidth>
                <DialogTitle>Round Result</DialogTitle>
                <DialogContent>
                   {renderResultContent()}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseResultModal} variant="contained">Play Again</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isHintModalOpen} onClose={handleCloseHintModal}>
                <DialogTitle>Suggested Move</DialogTitle>
                <DialogContent sx={{ display: 'flex', justifyContent: 'center' }}>
                    {hint && (
                        <Paper elevation={0} sx={{ p: 2, textAlign: 'center' }}>
                            <img
                                src={choiceImages[hint.name.toLowerCase()]}
                                alt={hint.name}
                                style={{ width: 150, height: 150, objectFit: 'cover', borderRadius: '4px' }}
                            />
                            <Typography variant="h6" sx={{ mt: 1, textTransform: 'capitalize' }}>
                                {hint.name}
                            </Typography>
                        </Paper>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseHintModal}>Close</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Play;
