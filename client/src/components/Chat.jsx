import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {mockResponses} from '../data/mockResponses';
import {getGeminiResponse} from '../utils/ai/geminiService';
import '../styles/Chat.css';

function Chat() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState(null);
    const [aiRequestCount, setAiRequestCount] = useState(0);
    const [rateLimitWarning, setRateLimitWarning] = useState(false);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    const BOT_NAME = 'Mindful Bot';
    const MAX_AI_REQUESTS_PER_HOUR = 50; // Conservative limit for free tier

    useEffect(() => {
        // Load and manage AI request count from localStorage
        const currentHour = new Date().getHours();
        const savedData = localStorage.getItem('mindful-ai-usage');

        if (savedData) {
            const usageData = JSON.parse(savedData);
            if (usageData.hour === currentHour) {
                setAiRequestCount(usageData.count);
                if (usageData.count >= MAX_AI_REQUESTS_PER_HOUR * 0.8) {
                    setRateLimitWarning(true);
                }
            } else {
                // New hour, reset count
                setAiRequestCount(0);
                setRateLimitWarning(false);
                localStorage.setItem('mindful-ai-usage', JSON.stringify({
                    count: 0,
                    hour: currentHour
                }));
            }
        } else {
            // Initialize usage tracking
            localStorage.setItem('mindful-ai-usage', JSON.stringify({
                count: 0,
                hour: currentHour
            }));
        }
    }, []);

    useEffect(() => {
        // Load chat history from localStorage
        const savedMessages = localStorage.getItem('mindful-chat-history');
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
        } else {
            // Welcome message
            const welcomeMessage = {
                id: Date.now(),
                text: "Hello! I'm here to listen and support you. How are you feeling today?",
                sender: 'bot',
                timestamp: new Date().toISOString()
            };
            setMessages([welcomeMessage]);
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Save chat history to localStorage
        if (messages.length > 0) {
            localStorage.setItem('mindful-chat-history', JSON.stringify(messages));
        }
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    };

    const formatTime = (iso) => {
        try {
            const d = new Date(iso);
            return d.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
        } catch {
            return '';
        }
    };

    const trackAiRequest = () => {
        const currentHour = new Date().getHours();
        const newCount = aiRequestCount + 1;
        setAiRequestCount(newCount);

        localStorage.setItem('mindful-ai-usage', JSON.stringify({
            count: newCount,
            hour: currentHour
        }));

        if (newCount >= MAX_AI_REQUESTS_PER_HOUR * 0.8) {
            setRateLimitWarning(true);
        }
    };

    const getRandomResponse = (userMessage) => {
        const lowerMessage = userMessage.toLowerCase();

        // Youth-specific categories first
        if (lowerMessage.includes('school') || lowerMessage.includes('exam') || lowerMessage.includes('homework') ||
            lowerMessage.includes('college') || lowerMessage.includes('study') || lowerMessage.includes('grades')) {
            return mockResponses.academic[Math.floor(Math.random() * mockResponses.academic.length)];
        } else if (lowerMessage.includes('friends') || lowerMessage.includes('social') || lowerMessage.includes('peer') ||
            lowerMessage.includes('fitting in') || lowerMessage.includes('belong')) {
            return mockResponses.social[Math.floor(Math.random() * mockResponses.social.length)];
        } else if (lowerMessage.includes('parents') || lowerMessage.includes('family') || lowerMessage.includes('home') ||
            lowerMessage.includes('mom') || lowerMessage.includes('dad')) {
            return mockResponses.family[Math.floor(Math.random() * mockResponses.family.length)];
        } else if (lowerMessage.includes('identity') || lowerMessage.includes('who am i') || lowerMessage.includes('self') ||
            lowerMessage.includes('confidence') || lowerMessage.includes('worth')) {
            return mockResponses.identity[Math.floor(Math.random() * mockResponses.identity.length)];
        }
        // Traditional mood categories
        else if (lowerMessage.includes('sad') || lowerMessage.includes('down') || lowerMessage.includes('depressed')) {
            return mockResponses.sad[Math.floor(Math.random() * mockResponses.sad.length)];
        } else if (lowerMessage.includes('anxious') || lowerMessage.includes('worried') || lowerMessage.includes('stress')) {
            return mockResponses.anxious[Math.floor(Math.random() * mockResponses.anxious.length)];
        } else if (lowerMessage.includes('angry') || lowerMessage.includes('frustrated') || lowerMessage.includes('mad')) {
            return mockResponses.angry[Math.floor(Math.random() * mockResponses.angry.length)];
        } else if (lowerMessage.includes('good') || lowerMessage.includes('great') || lowerMessage.includes('happy')) {
            return mockResponses.positive[Math.floor(Math.random() * mockResponses.positive.length)];
        } else {
            return mockResponses.general[Math.floor(Math.random() * mockResponses.general.length)];
        }
    };

    const handleSendMessage = async () => {
        const messageText = inputMessage.trim();
        if (!messageText) return;

        setError(null);

        const userMessage = {
            id: Date.now(),
            text: messageText,
            sender: 'user',
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsTyping(true);

        try {
            // Try to get a response from Google Gemini Pro
            const geminiApiKey = process.env.REACT_APP_GEMINI_API_KEY;

            console.log('Gemini API Key check:', geminiApiKey ? 'Key exists' : 'No key found');
            console.log('Key starts with:', geminiApiKey ? geminiApiKey.substring(0, 10) + '...' : 'N/A');

            if (geminiApiKey && geminiApiKey !== 'your_gemini_api_key_here') {
                // Check rate limit before making AI request
                if (aiRequestCount >= MAX_AI_REQUESTS_PER_HOUR) {
                    setError(`AI request limit reached (${MAX_AI_REQUESTS_PER_HOUR}/hour). Using local responses until next hour.`);
                    throw new Error('Rate limit exceeded');
                }

                console.log('Attempting to use Gemini API...');
                console.log(`AI Requests used: ${aiRequestCount}/${MAX_AI_REQUESTS_PER_HOUR} this hour`);

                try {
                    // Track the AI request
                    trackAiRequest();

                    // Enhanced mood detection for youth mental health context
                    let detectedMood = '';
                    const lowerText = messageText.toLowerCase();

                    // Academic/School stress
                    if (lowerText.includes('school') || lowerText.includes('exam') || lowerText.includes('homework') ||
                        lowerText.includes('college') || lowerText.includes('study') || lowerText.includes('grades')) {
                        detectedMood = 'academic stress';
                    }
                    // Social anxiety/peer pressure
                    else if (lowerText.includes('friends') || lowerText.includes('social') || lowerText.includes('peer') ||
                        lowerText.includes('fitting in') || lowerText.includes('belong')) {
                        detectedMood = 'social anxiety';
                    }
                    // Family issues
                    else if (lowerText.includes('parents') || lowerText.includes('family') || lowerText.includes('home') ||
                        lowerText.includes('mom') || lowerText.includes('dad')) {
                        detectedMood = 'family stress';
                    }
                    // Identity/self-esteem
                    else if (lowerText.includes('identity') || lowerText.includes('who am i') || lowerText.includes('self') ||
                        lowerText.includes('confidence') || lowerText.includes('worth')) {
                        detectedMood = 'identity concerns';
                    }
                    // Future anxiety
                    else if (lowerText.includes('future') || lowerText.includes('career') || lowerText.includes('job') ||
                        lowerText.includes('what if') || lowerText.includes('uncertain')) {
                        detectedMood = 'future anxiety';
                    }
                    // Traditional mood detection
                    else if (lowerText.includes('sad') || lowerText.includes('depressed') || lowerText.includes('down') ||
                        lowerText.includes('hopeless') || lowerText.includes('empty')) {
                        detectedMood = 'sadness';
                    }
                    else if (lowerText.includes('anxious') || lowerText.includes('worried') || lowerText.includes('stress') ||
                        lowerText.includes('panic') || lowerText.includes('nervous')) {
                        detectedMood = 'anxiety';
                    }
                    else if (lowerText.includes('angry') || lowerText.includes('frustrated') || lowerText.includes('mad') ||
                        lowerText.includes('annoyed') || lowerText.includes('rage')) {
                        detectedMood = 'anger';
                    }
                    else if (lowerText.includes('happy') || lowerText.includes('good') || lowerText.includes('great') ||
                        lowerText.includes('excited') || lowerText.includes('awesome')) {
                        detectedMood = 'positive';
                    }
                    else if (lowerText.includes('lonely') || lowerText.includes('alone') || lowerText.includes('isolated')) {
                        detectedMood = 'loneliness';
                    }
                    else if (lowerText.includes('tired') || lowerText.includes('exhausted') || lowerText.includes('sleep')) {
                        detectedMood = 'fatigue';
                    }

                    // Get previous messages for context
                    const chatHistory = messages.slice(-6); // Last 6 messages

                    // Call Gemini API with context
                    console.log('Calling Gemini API with message:', messageText);
                    const geminiResponse = await getGeminiResponse(messageText, detectedMood, chatHistory);
                    console.log('Gemini response received:', geminiResponse);

                    const botResponse = {
                        id: Date.now() + 1,
                        text: geminiResponse,
                        sender: 'bot',
                        timestamp: new Date().toISOString(),
                        source: 'gemini' // Mark the source for potential UI differentiation
                    };

                    setMessages(prev => [...prev, botResponse]);
                    return; // Exit early since we got a successful response
                } catch (geminiError) {
                    console.error('Gemini API error:', geminiError);
                    setError('Gemini API failed, falling back to local responses.');
                    // Fall through to backup options
                }
            } else {
                console.log('Gemini API key not configured, using fallback');
            }

            // Fallback to backend server if Gemini fails or is not configured
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/chat/message`, {
                    message: messageText,
                    sessionId: 'web-client'
                });

                const botResponse = {
                    id: Date.now() + 1,
                    text: response?.data?.data?.message ?? getRandomResponse(messageText),
                    sender: 'bot',
                    timestamp: new Date().toISOString(),
                    source: 'backend'
                };

                setMessages(prev => [...prev, botResponse]);
            } catch (serverError) {
                console.error('Backend API error:', serverError);
                setError('Having trouble reaching our services. Using offline responses for now.');
                // Final fallback to mock responses
                const botResponse = {
                    id: Date.now() + 1,
                    text: getRandomResponse(messageText),
                    sender: 'bot',
                    timestamp: new Date().toISOString(),
                    source: 'mock'
                };
                setMessages(prev => [...prev, botResponse]);
            }
        } catch (error) {
            console.error('Overall chat error:', error);
            setError('Having trouble with our chat services. Please try again later.');
            // Ultimate fallback
            const botResponse = {
                id: Date.now() + 1,
                text: getRandomResponse(messageText),
                sender: 'bot',
                timestamp: new Date().toISOString(),
                source: 'mock'
            };
            setMessages(prev => [...prev, botResponse]);
        } finally {
            setIsTyping(false);
            // Refocus textarea for quick chatting
            textareaRef.current?.focus();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const clearChat = () => {
        setMessages([]);
        localStorage.removeItem('mindful-chat-history');
        setError(null);
        setTimeout(() => {
            const welcomeMessage = {
                id: Date.now(),
                text: "Welcome back! I'm here whenever you want to talk.",
                sender: 'bot',
                timestamp: new Date().toISOString()
            };
            setMessages([welcomeMessage]);
        }, 50);
    };

    const renderAvatar = (sender) => (
        <div className={`avatar ${sender}`} aria-hidden="true">{sender === 'bot' ? '🤖' : '🙂'}</div>
    );

    return (
        <div className="page chat-page">
            <div className="chat-header enhanced">
                <div className="header-left">
                    <div className="avatar bot large">🤖</div>
                    <div className="agent-info">
                        <div className="name-row">
                            <h2>{BOT_NAME}</h2>
                            <span className="status-dot online" title="Online" />
                        </div>
                        <div className="subtle">{isTyping ? 'typing…' : 'Here to support you 💙'}</div>
                    </div>
                </div>
                <div className="header-actions">
                    <div className="rate-limit-info">
                        <span className={`usage-count ${rateLimitWarning ? 'warning' : ''}`}
                            title={`AI requests used this hour. Resets every hour.`}>
                            AI: {aiRequestCount}/{MAX_AI_REQUESTS_PER_HOUR}
                        </span>
                    </div>
                    <button onClick={clearChat} className="btn btn-secondary btn-small" aria-label="Clear chat history">Clear Chat</button>
                </div>
            </div>

            {rateLimitWarning && !error && (
                <div className="banner warning" role="alert">
                    <span>⚡ Approaching AI request limit ({aiRequestCount}/{MAX_AI_REQUESTS_PER_HOUR}). Consider spacing out your messages to avoid switching to local responses.</span>
                    <button className="banner-dismiss" onClick={() => setRateLimitWarning(false)} aria-label="Dismiss">✖</button>
                </div>
            )}

            {error && (
                <div className="banner error" role="alert">
                    <span>⚠️ {error}</span>
                    <button className="banner-dismiss" onClick={() => setError(null)} aria-label="Dismiss">✖</button>
                </div>
            )}

            <div className="chat-container">
                <div className="chat-messages">
                    {messages.map((message, idx) => {
                        const prev = messages[idx - 1];
                        const isFirstInGroup = !prev || prev.sender !== message.sender;
                        return (
                            <div key={message.id} className={`message ${message.sender} ${isFirstInGroup ? 'first' : 'continued'}`}>
                                {message.sender === 'bot' && isFirstInGroup && renderAvatar('bot')}
                                <div className="message-bubble">
                                    <p>{message.text}</p>
                                    <div className="message-meta">
                                        <span className="message-time">{formatTime(message.timestamp)}</span>
                                        {message.source === 'gemini' && (
                                            <span className="message-source gemini" title="Powered by Google Gemini">AI</span>
                                        )}
                                    </div>
                                </div>
                                {message.sender === 'user' && isFirstInGroup && renderAvatar('user')}
                            </div>
                        );
                    })}

                    {isTyping && (
                        <div className="message bot first">
                            {renderAvatar('bot')}
                            <div className="message-bubble typing">
                                <span>●</span>
                                <span>●</span>
                                <span>●</span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                <div className="chat-input enhanced">
                    <div className="input-toolbar left">
                        <button className="icon-btn" title="Emoji" aria-label="Emoji" type="button">😊</button>
                        <button className="icon-btn" title="Attach" aria-label="Attach" type="button">📎</button>
                    </div>
                    <textarea
                        ref={textareaRef}
                        rows={1}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                        placeholder="Share what's on your mind... (Shift+Enter for a new line)"
                        disabled={isTyping}
                    />
                    <div className="input-toolbar right">
                        <button
                            onClick={handleSendMessage}
                            disabled={isTyping || !inputMessage.trim()}
                            className="btn btn-primary send-btn"
                            type="button"
                        >
                            Send ➤
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;