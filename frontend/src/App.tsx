import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Profile from './Profile';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/profile" element={<Profile />} />
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
