import React, {useState, useEffect} from 'react';
import {getStoredData, saveData} from '../utils/localStorage';
import '../styles/MoodTracker.css';

function MoodTracker() {
    const [currentMood, setCurrentMood] = useState(5);
    const [note, setNote] = useState('');
    const [moodHistory, setMoodHistory] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [selectedMoodAnimation, setSelectedMoodAnimation] = useState(null);

    const moods = [
        {value: 1, emoji: '😢', label: 'Very Sad', color: '#FF6B6B', bgColor: '#FFE5E5'},
        {value: 2, emoji: '😟', label: 'Sad', color: '#FF8E53', bgColor: '#FFE8E0'},
        {value: 3, emoji: '😐', label: 'Neutral', color: '#4ECDC4', bgColor: '#E5F9F7'},
        {value: 4, emoji: '🙂', label: 'Good', color: '#45B7D1', bgColor: '#E5F4FD'},
        {value: 5, emoji: '😊', label: 'Happy', color: '#96CEB4', bgColor: '#F0F9F4'},
        {value: 6, emoji: '😃', label: 'Very Happy', color: '#FECA57', bgColor: '#FEF7E5'},
        {value: 7, emoji: '🤩', label: 'Excellent', color: '#48CAE4', bgColor: '#E8F8FC'}
    ];

    useEffect(() => {
        const history = getStoredData('mood-history', []);
        setMoodHistory(history);
    }, []);

    const handleSubmitMood = () => {
        setIsAnimating(true);

        const moodEntry = {
            id: Date.now(),
            mood: currentMood,
            note: note.trim(),
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString()
        };

        const newHistory = [moodEntry, ...moodHistory];
        setMoodHistory(newHistory);
        saveData('mood-history', newHistory);

        setNote('');
        setShowSuccess(true);

        setTimeout(() => {
            setIsAnimating(false);
            setShowSuccess(false);
        }, 3000);
    };

    const handleMoodSelect = (moodValue) => {
        setCurrentMood(moodValue);
        setSelectedMoodAnimation(moodValue);
        setTimeout(() => setSelectedMoodAnimation(null), 300);
    };

    const getAverageMood = () => {
        if (moodHistory.length === 0) return 0;
        const sum = moodHistory.reduce((acc, entry) => acc + entry.mood, 0);
        return (sum / moodHistory.length).toFixed(1);
    };

    const getMoodTrend = () => {
        if (moodHistory.length < 2) return 'neutral';
        const recent = moodHistory.slice(0, 3).reduce((acc, entry) => acc + entry.mood, 0) / Math.min(3, moodHistory.length);
        const older = moodHistory.slice(3, 6).reduce((acc, entry) => acc + entry.mood, 0) / Math.min(3, moodHistory.slice(3).length);

        if (recent > older + 0.5) return 'improving';
        if (recent < older - 0.5) return 'declining';
        return 'stable';
    };

    return (
        <div className="page mood-page">
            {/* Enhanced Header */}
            <div className="mood-header">
                <div className="header-content">
                    <h2 className="mood-title">
                        <span className="title-icon">📊</span>
                        Mood Tracker
                        <span className="title-subtitle">Track your emotional wellness journey</span>
                    </h2>
                    {moodHistory.length > 0 && (
                        <div className="quick-stats">
                            <div className="quick-stat">
                                <span className="stat-number">{moodHistory.length}</span>
                                <span className="stat-label">entries</span>
                            </div>
                            <div className="quick-stat">
                                <span className="stat-number">{getAverageMood()}</span>
                                <span className="stat-label">avg mood</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mood-tracker">
                {/* Enhanced Mood Selector */}
                <div className="mood-selector">
                    <h3 className="section-title">
                        <span className="section-icon">💭</span>
                        How are you feeling today?
                    </h3>
                    <div className="mood-options">
                        {moods.map(mood => (
                            <button
                                key={mood.value}
                                className={`mood-option ${currentMood === mood.value ? 'selected' : ''} ${selectedMoodAnimation === mood.value ? 'animating' : ''}`}
                                onClick={() => handleMoodSelect(mood.value)}
                                style={{
                                    '--mood-color': mood.color,
                                    '--mood-bg': mood.bgColor
                                }}
                            >
                                <span className="mood-emoji">{mood.emoji}</span>
                                <span className="mood-label">{mood.label}</span>
                                <span className="mood-value">{mood.value}</span>
                            </button>
                        ))}
                    </div>

                    {/* Mood Scale Indicator */}
                    <div className="mood-scale">
                        <div className="scale-track">
                            <div
                                className="scale-indicator"
                                style={{
                                    left: `${((currentMood - 1) / 6) * 100}%`,
                                    backgroundColor: moods.find(m => m.value === currentMood)?.color
                                }}
                            ></div>
                        </div>
                        <div className="scale-labels">
                            <span>Low</span>
                            <span>High</span>
                        </div>
                    </div>
                </div>

                {/* Enhanced Note Section */}
                <div className="mood-note">
                    <h3 className="section-title">
                        <span className="section-icon">📝</span>
                        Add a note
                        <span className="optional-badge">optional</span>
                    </h3>
                    <div className="textarea-container">
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="What's contributing to your mood today? Share your thoughts, experiences, or anything that influenced how you're feeling..."
                            rows="4"
                            maxLength="500"
                        />
                        <div className="character-count">
                            <span className={note.length > 400 ? 'warning' : ''}>{note.length}/500</span>
                        </div>
                    </div>
                </div>

                {/* Enhanced Submit Button */}
                <button
                    onClick={handleSubmitMood}
                    className={`btn btn-primary mood-submit ${isAnimating ? 'submitting' : ''}`}
                    disabled={isAnimating}
                >
                    <span className="btn-icon">💾</span>
                    {isAnimating ? 'Saving...' : 'Save Mood Entry'}
                    <span className="btn-sparkle">✨</span>
                </button>

                {/* Enhanced Success Message */}
                {showSuccess && (
                    <div className="success-message enhanced">
                        <span className="success-icon">✅</span>
                        <span className="success-text">Mood entry saved successfully!</span>
                        <span className="success-subtext">Keep tracking your emotional wellness journey</span>
                    </div>
                )}
            </div>

            {/* Enhanced Mood Stats */}
            {moodHistory.length > 0 && (
                <div className="mood-stats">
                    <h3 className="section-title">
                        <span className="section-icon">📈</span>
                        Your Mood Insights
                    </h3>
                    <div className="stats-grid">
                        <div className="stat-card average">
                            <div className="stat-header">
                                <span className="stat-icon">📊</span>
                                <h4>Average Mood</h4>
                            </div>
                            <p className="stat-value">{getAverageMood()}<span className="stat-unit">/7</span></p>
                            <div className="stat-visual">
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{width: `${(getAverageMood() / 7) * 100}%`}}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="stat-card entries">
                            <div className="stat-header">
                                <span className="stat-icon">📅</span>
                                <h4>Total Entries</h4>
                            </div>
                            <p className="stat-value">{moodHistory.length}</p>
                            <p className="stat-description">
                                {moodHistory.length === 1 ? 'First entry!' :
                                    moodHistory.length < 7 ? 'Building habit' :
                                        moodHistory.length < 30 ? 'Great progress' : 'Consistency champion!'}
                            </p>
                        </div>

                        <div className="stat-card trend">
                            <div className="stat-header">
                                <span className="stat-icon">📈</span>
                                <h4>Recent Trend</h4>
                            </div>
                            <p className={`stat-value trend-${getMoodTrend()}`}>
                                {getMoodTrend() === 'improving' && (
                                    <>
                                        <span className="trend-icon">📈</span>
                                        <span>Improving</span>
                                    </>
                                )}
                                {getMoodTrend() === 'declining' && (
                                    <>
                                        <span className="trend-icon">📉</span>
                                        <span>Needs attention</span>
                                    </>
                                )}
                                {getMoodTrend() === 'stable' && (
                                    <>
                                        <span className="trend-icon">➡️</span>
                                        <span>Stable</span>
                                    </>
                                )}
                            </p>
                            <p className="stat-description">
                                {getMoodTrend() === 'improving' && 'Keep up the great work!'}
                                {getMoodTrend() === 'declining' && 'Consider reaching out for support'}
                                {getMoodTrend() === 'stable' && 'Consistency is key'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Enhanced History Section */}
            <div className="mood-history">
                <div className="history-header">
                    <h3 className="section-title">
                        <span className="section-icon">📋</span>
                        Recent Entries
                    </h3>
                    {moodHistory.length > 10 && (
                        <button className="view-all-btn">
                            View All ({moodHistory.length})
                        </button>
                    )}
                </div>

                {moodHistory.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">🌱</div>
                        <h4>Start Your Wellness Journey</h4>
                        <p>No mood entries yet. Begin tracking your emotional wellness today and build a habit of self-awareness!</p>
                        <div className="empty-tips">
                            <div className="tip">
                                <span className="tip-icon">💡</span>
                                <span>Track daily for better insights</span>
                            </div>
                            <div className="tip">
                                <span className="tip-icon">🎯</span>
                                <span>Notes help identify patterns</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="history-list">
                        {moodHistory.slice(0, 10).map((entry, index) => {
                            const mood = moods.find(m => m.value === entry.mood);
                            const isToday = entry.date === new Date().toISOString().split('T')[0];
                            const isRecent = index < 3;

                            return (
                                <div
                                    key={entry.id}
                                    className={`history-item ${isToday ? 'today' : ''} ${isRecent ? 'recent' : ''}`}
                                    style={{'--mood-color': mood.color, '--mood-bg': mood.bgColor}}
                                >
                                    <div className="history-mood">
                                        <span className="history-emoji">{mood.emoji}</span>
                                        <div className="history-mood-info">
                                            <span className="history-label">{mood.label}</span>
                                            <span className="history-value">{mood.value}/7</span>
                                        </div>
                                    </div>

                                    <div className="history-details">
                                        <div className="history-date-info">
                                            <span className="history-date">
                                                {isToday ? 'Today' : entry.date}
                                            </span>
                                            <span className="history-time">
                                                {new Date(entry.timestamp).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        {entry.note && (
                                            <p className="history-note">
                                                <span className="note-icon">💭</span>
                                                {entry.note}
                                            </p>
                                        )}
                                    </div>

                                    {isToday && <div className="today-badge">Today</div>}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MoodTracker;