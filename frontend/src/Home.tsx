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
                <br />
                <Typography variant="body2">
                    An expanded take on Rock, Paper, Scissors. Hover over an icon to see what it wins against (green) and what it loses to (red).
                </Typography>
                <Typography variant="body2">

                </Typography>
                <GameExplanation />
            </Box>
        </Container>
    );
};

export default Home;