import { Container, Box, Typography } from "@mui/material";
import React from "react";
import GameExplanation from "./GameExplanation";

const Home: React.FC = () => {
    return (
        <Container>
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                   Home Page
                </Typography>
                <br />
                <Typography variant="body1">
                    Rock, Paper, Scissors, Lizard, Spock Game
                </Typography>
                <br/>
                <Typography variant="body2">
                    This is an expanded version of the classic game "Rock, Paper, Scissors". Hover over the game icons in order to see which ones beat which, the ones it beat will be highlighted in green and the one it loses to will be highlighted in red.
                </Typography>
                <Typography variant="body2">
                    
                </Typography>
                <GameExplanation />
            </Box>
        </Container>
    );
};

export default Home;