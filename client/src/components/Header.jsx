import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import '../styles/Header.css';

function Header({theme}) {
    const location = useLocation();

    const navItems = [
        {path: '/', label: 'Home'},
        {path: '/chat', label: 'Chat'},
        {path: '/mood', label: 'Mood'},
        {path: '/wellness', label: 'Wellness'},
        {path: '/resources', label: 'Resources'},
        {path: '/settings', label: 'Settings'}
    ];

    return (
        <header className={`header ${theme}`}>
            <div className="header-container">
                <Link to="/" className="logo">
                    <h1>🧠 MindfulSpace</h1>
                </Link>
                <nav className="nav">
                    {navItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}

export default Header;