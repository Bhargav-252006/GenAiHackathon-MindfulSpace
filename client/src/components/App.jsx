import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Header from './Header';
import Home from './Home';
import Chat from './Chat';
import MoodTracker from './MoodTracker';
import Wellness from './Wellness';
import Resources from './Resources';
import Settings from './Settings';
import '../styles/App.css';

function App() {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('mindful-theme') || 'light';
        setTheme(savedTheme);
        document.body.className = savedTheme;
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('mindful-theme', newTheme);
        document.body.className = newTheme;
    };

    return (
        <Router>
            <div className={`app ${theme}`}>
                <Header theme={theme} />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/chat" element={<Chat />} />
                        <Route path="/mood" element={<MoodTracker />} />
                        <Route path="/wellness" element={<Wellness />} />
                        <Route path="/resources" element={<Resources />} />
                        <Route path="/settings" element={<Settings theme={theme} toggleTheme={toggleTheme} />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;