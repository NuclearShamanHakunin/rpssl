import React from 'react';
import { 
    BrowserRouter as Router, 
    Routes, 
    Route, 
    Link,
    useNavigate, 
    Navigate 
} from 'react-router-dom';
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    Button, 
    Container, 
    Box, 
    CssBaseline, 
    createTheme, 
    ThemeProvider 
} from '@mui/material';

import Login from './Login';
import Profile from './Profile';
import Play from './Play';
import Leaderboard from './Leaderboard';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },  
});


interface PrivateRouteProps {
  children: React.ReactNode;
}


const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = localStorage.getItem('token');

  return token ? <>{children}</> : <Navigate to="/login" />;
};


const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
        window.location.reload();
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Button color="inherit" component={Link} to="/">Home</Button>
                    {token && (
                        <>
                            <Button color="inherit" component={Link} to="/play">Play</Button>
                            <Button color="inherit" component={Link} to="/profile">Profile</Button>
                        </>
                    )}
                </Typography>

                <Button color="inherit" component={Link} to="/leaderboard">Leaderboard</Button>
                {token ? (
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                ) : (
                    <Button color="inherit" component={Link} to="/login">Login</Button>
                )}
            </Toolbar>
        </AppBar>
    );
};


const Home: React.FC = () => {
    return (
        <Container>
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                   Home Page
                </Typography>
                <Typography variant="body1">
                    Rock, Paper, Scissors, Lizard, Spock Game
                </Typography>
            </Box>
        </Container>
    );
};


const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Navbar />
                <main>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<Home />} />
                        <Route
                            path="/profile"
                            element={
                                <PrivateRoute>
                                    <Profile />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/play"
                            element={
                                <PrivateRoute>
                                    <Play />
                                </PrivateRoute>
                            }
                        />
                        <Route path="/leaderboard" element={<Leaderboard />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </main>
            </Router>
        </ThemeProvider>
    );
}

export default App;
