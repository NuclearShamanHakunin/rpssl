import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Profile from './Profile';
import './App.css';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/profile"
                            element={
                                <PrivateRoute>
                                    <Profile />
                                </PrivateRoute>
                            }
                        />
                        <Route path="/" element={<Home />} />
                    </Routes>
                </header>
            </div>
        </Router>
    );
}

const Home = () => {
    const [message, setMessage] = React.useState('');

    React.useEffect(() => {
        fetch('/api')
            .then((res) => res.text())
            .then((data) => setMessage(data));
    }, []);

    return <>
        <p>{message}</p>
    </>
};

export default App;
