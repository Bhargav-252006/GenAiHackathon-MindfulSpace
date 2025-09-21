import React from 'react';

function Settings({theme, toggleTheme}) {
    const clearAllData = () => {
        if (window.confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
            localStorage.clear();
            window.location.reload();
        }
    };

    const exportData = () => {
        const data = {
            moodHistory: JSON.parse(localStorage.getItem('mood-history') || '[]'),
            chatHistory: JSON.parse(localStorage.getItem('mindful-chat-history') || '[]'),
            theme: localStorage.getItem('mindful-theme') || 'light',
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mindful-space-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="page settings-page">
            <h2>⚙️ Settings</h2>

            <div className="settings-section">
                <h3>Appearance</h3>
                <div className="setting-item">
                    <div className="setting-info">
                        <h4>Theme</h4>
                        <p>Choose between light and dark mode</p>
                    </div>
                    <button onClick={toggleTheme} className="btn btn-secondary">
                        {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
                    </button>
                </div>
            </div>

            <div className="settings-section">
                <h3>Data Management</h3>

                <div className="setting-item">
                    <div className="setting-info">
                        <h4>Export Data</h4>
                        <p>Download your mood tracking and chat history</p>
                    </div>
                    <button onClick={exportData} className="btn btn-primary">
                        📥 Export Data
                    </button>
                </div>

                <div className="setting-item">
                    <div className="setting-info">
                        <h4>Clear All Data</h4>
                        <p>Permanently delete all your local data</p>
                    </div>
                    <button onClick={clearAllData} className="btn btn-danger">
                        🗑️ Clear Data
                    </button>
                </div>
            </div>

            <div className="settings-section">
                <h3>About</h3>
                <div className="about-info">
                    <h4>MindfulSpace v1.0.0</h4>
                    <p>
                        A local mental health support application designed for testing and development purposes.
                        All data is stored locally on your device and is not shared with any external services.
                    </p>

                    <div className="features-list">
                        <h5>Features:</h5>
                        <ul>
                            <li>✅ Local mood tracking</li>
                            <li>✅ Mock chat support</li>
                            <li>✅ Breathing exercises</li>
                            <li>✅ Mental health resources</li>
                            <li>✅ Dark/Light theme</li>
                            <li>✅ Data export</li>
                        </ul>
                    </div>

                    <div className="privacy-info">
                        <h5>Privacy:</h5>
                        <p>
                            Your data never leaves your device. Everything is stored locally in your browser's
                            localStorage. No data is transmitted to external servers.
                        </p>
                    </div>
                </div>
            </div>

            <div className="settings-section">
                <h3>Support</h3>
                <div className="support-info">
                    <p>
                        This is a development/testing application. For real mental health support,
                        please consult with qualified professionals or contact:
                    </p>
                    <ul>
                        <li>National Suicide Prevention Lifeline: 988</li>
                        <li>Crisis Text Line: Text HOME to 741741</li>
                        <li>Your local emergency services: 911</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Settings;