import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import '../styles/Home.css';

function Home() {
    const [scrolled, setScrolled] = useState(false);
    const [activeCard, setActiveCard] = useState(null);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 100;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Start with elements animating in
        const timer = setTimeout(() => {
            document.querySelector('.hero-content').classList.add('animated');
        }, 300);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(timer);
        };
    }, [scrolled]);

    const handleCardHover = (index) => {
        setActiveCard(index);
    };
    return (
        <div className={`page home-page ${scrolled ? 'scrolled' : ''}`}>
            {/* Animated background elements */}
            <div className="floating-elements">
                <div className="floating-element e1"></div>
                <div className="floating-element e2"></div>
                <div className="floating-element e3"></div>
                <div className="floating-element e4"></div>
            </div>

            <div className="hero-section parallax-bg">
                <div className="hero-content">
                    <h1 className="glowing-text">You're Not Alone <span className="emoji-bounce">🤗</span></h1>
                    <p className="hero-subtitle typewriter">Hey there! We get it. Some days are harder than others.</p>
                    <p className="hero-description reveal-text">
                        MindfulSpace is your safe corner of the internet - a judgment-free zone where you can check in with yourself,
                        track your feelings, and find support when you need it most. <span className="sparkle">✨</span>
                    </p>
                    <div className="hero-actions">
                        <Link to="/chat" className="btn btn-primary pulse">
                            <span className="btn-icon">💬</span>
                            <span className="btn-text">Talk It Out</span>
                        </Link>
                        <Link to="/mood" className="btn btn-secondary float">
                            <span className="btn-icon">🌟</span>
                            <span className="btn-text">How Am I Today?</span>
                        </Link>
                    </div>
                    <div className="hero-note">
                        <small className="fade-in">💙 Your mental health matters. Take it one day at a time.</small>
                    </div>
                </div>
            </div>

            <div className="quick-stats">
                <div className="stat-item">
                    <span className="stat-number">1 in 5</span>
                    <span className="stat-text">young adults experience mental health challenges</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">You're here</span>
                    <span className="stat-text">and that's a brave first step 💪</span>
                </div>
            </div>

            <div className="features-grid">
                <div
                    className={`feature-card chat-card ${activeCard === 0 ? 'active' : ''}`}
                    onMouseEnter={() => handleCardHover(0)}
                    onMouseLeave={() => handleCardHover(null)}
                >
                    <div className="card-bg"></div>
                    <div className="feature-icon bubble">💬</div>
                    <h3>Vent Without Judgment</h3>
                    <p>Sometimes you just need someone to listen. Our chat is here 24/7 - no weird questions, no pressure, just support.</p>
                    <div className="feature-tags">
                        <span className="tag glow">Anonymous</span>
                        <span className="tag glow">Safe Space</span>
                    </div>
                    <Link to="/chat" className="feature-link">
                        <span className="link-text">Start Chatting</span>
                        <span className="link-arrow">→</span>
                    </Link>
                </div>

                <div
                    className={`feature-card mood-card ${activeCard === 1 ? 'active' : ''}`}
                    onMouseEnter={() => handleCardHover(1)}
                    onMouseLeave={() => handleCardHover(null)}
                >
                    <div className="card-bg"></div>
                    <div className="feature-icon wave">📊</div>
                    <h3>Track Your Vibe</h3>
                    <p>Bad day? Good day? Meh day? Keep track of your mood patterns and celebrate the small wins along the way.</p>
                    <div className="feature-tags">
                        <span className="tag glow">Private</span>
                        <span className="tag glow">Insights</span>
                    </div>
                    <Link to="/mood" className="feature-link">
                        <span className="link-text">Check My Mood</span>
                        <span className="link-arrow">→</span>
                    </Link>
                </div>

                <div
                    className={`feature-card wellness-card ${activeCard === 2 ? 'active' : ''}`}
                    onMouseEnter={() => handleCardHover(2)}
                    onMouseLeave={() => handleCardHover(null)}
                >
                    <div className="card-bg"></div>
                    <div className="feature-icon float">🧘‍♀️</div>
                    <h3>Chill Out Zone</h3>
                    <p>Stressed? Anxious? Take a breather with quick mindfulness exercises that actually work (we promise, no boring meditation here).</p>
                    <div className="feature-tags">
                        <span className="tag glow">Quick & Easy</span>
                        <span className="tag glow">Science-backed</span>
                    </div>
                    <Link to="/wellness" className="feature-link">
                        <span className="link-text">Find My Zen</span>
                        <span className="link-arrow">→</span>
                    </Link>
                </div>

                <div
                    className={`feature-card resources-card ${activeCard === 3 ? 'active' : ''}`}
                    onMouseEnter={() => handleCardHover(3)}
                    onMouseLeave={() => handleCardHover(null)}
                >
                    <div className="card-bg"></div>
                    <div className="feature-icon rotate">📚</div>
                    <h3>Real Help, Real People</h3>
                    <p>Need more than just our app? We've got links to actual therapists, crisis hotlines, and resources that can make a difference.</p>
                    <div className="feature-tags">
                        <span className="tag glow">Professional Help</span>
                        <span className="tag glow">Crisis Support</span>
                    </div>
                    <Link to="/resources" className="feature-link">
                        <span className="link-text">Get Resources</span>
                        <span className="link-arrow">→</span>
                    </Link>
                </div>
            </div>

            <div className="encouragement-section reveal">
                <div className="encouragement-bg-elements">
                    <div className="enc-element e1"></div>
                    <div className="enc-element e2"></div>
                    <div className="enc-element e3"></div>
                </div>
                <div className="encouragement-content">
                    <h2 className="animated-gradient-text">🌈 Remember</h2>
                    <div className="encouragement-grid">
                        <div className="encouragement-item fade-in-item">
                            <span className="encouragement-emoji pulse-slow">🌱</span>
                            <p>Healing isn't linear - ups and downs are part of the journey</p>
                            <div className="item-highlight"></div>
                        </div>
                        <div className="encouragement-item fade-in-item delay-1">
                            <span className="encouragement-emoji pulse-slow">🤝</span>
                            <p>Asking for help is a sign of strength, not weakness</p>
                            <div className="item-highlight"></div>
                        </div>
                        <div className="encouragement-item fade-in-item delay-2">
                            <span className="encouragement-emoji pulse-slow">⭐</span>
                            <p>Small steps count - even checking this app is progress</p>
                            <div className="item-highlight"></div>
                        </div>
                        <div className="encouragement-item fade-in-item delay-3">
                            <span className="encouragement-emoji pulse-slow">💝</span>
                            <p>You deserve kindness, especially from yourself</p>
                            <div className="item-highlight"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="crisis-banner">
                <div className="pulse-outline"></div>
                <div className="crisis-content">
                    <h3><span className="alert-icon">🚨</span> Need Help Right Now?</h3>
                    <p>If you're having thoughts of self-harm or suicide, please reach out immediately:</p>
                    <div className="crisis-buttons">
                        <a href="tel:988" className="crisis-btn">
                            <span className="btn-icon pulse-subtle">📞</span>
                            <span className="btn-label">Call 988</span>
                        </a>
                        <a href="sms:741741&body=HOME" className="crisis-btn">
                            <span className="btn-icon pulse-subtle">💬</span>
                            <span className="btn-label">Text HOME to 741741</span>
                        </a>
                        <Link to="/resources" className="crisis-btn secondary">
                            <span className="btn-icon">🔗</span>
                            <span className="btn-label">More Resources</span>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="scroll-indicator">
                <div className="mouse">
                    <div className="wheel"></div>
                </div>
                <div className="arrow-scroll">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    );
}

export default Home;