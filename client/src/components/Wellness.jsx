import React, {useState, useEffect, useRef} from 'react';

function Wellness() {
    const [breathingActive, setBreathingActive] = useState(false);
    const [breathingPhase, setBreathingPhase] = useState('inhale'); // inhale, hold, exhale
    const [breathingCount, setBreathingCount] = useState(0);
    const [sessionTime, setSessionTime] = useState(0);
    const intervalRef = useRef(null);
    const phaseIntervalRef = useRef(null);

    const breathingCycle = {
        inhale: 6000,   // 6 seconds
        hold: 4000,     // 4 seconds  
        exhale: 6000    // 6 seconds
    };

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (phaseIntervalRef.current) clearInterval(phaseIntervalRef.current);
        };
    }, []);

    const startBreathing = () => {
        setBreathingActive(true);
        setBreathingCount(0);
        setSessionTime(0);
        setBreathingPhase('inhale');

        // Timer for session duration
        intervalRef.current = setInterval(() => {
            setSessionTime(prev => prev + 1);
        }, 1000);

        // Breathing cycle timer
        cycleBreathing();
    };

    const cycleBreathing = () => {
        const cycle = () => {
            // Inhale phase
            setBreathingPhase('inhale');
            phaseIntervalRef.current = setTimeout(() => {
                // Hold phase
                setBreathingPhase('hold');
                phaseIntervalRef.current = setTimeout(() => {
                    // Exhale phase
                    setBreathingPhase('exhale');
                    phaseIntervalRef.current = setTimeout(() => {
                        setBreathingCount(prev => prev + 1);
                        if (breathingActive) {
                            cycle(); // Continue the cycle
                        }
                    }, breathingCycle.exhale);
                }, breathingCycle.hold);
            }, breathingCycle.inhale);
        };

        cycle();
    };

    const stopBreathing = () => {
        setBreathingActive(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (phaseIntervalRef.current) clearTimeout(phaseIntervalRef.current);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getPhaseInstruction = () => {
        switch (breathingPhase) {
            case 'inhale':
                return 'Breathe in slowly...';
            case 'hold':
                return 'Hold your breath...';
            case 'exhale':
                return 'Breathe out slowly...';
            default:
                return 'Ready to begin';
        }
    };

    const affirmations = [
        "I am calm and centered",
        "I choose peace over worry",
        "I am strong and resilient",
        "This moment is all I need",
        "I release what I cannot control",
        "I am worthy of love and happiness",
        "I trust in my ability to handle challenges",
        "I am grateful for this moment of peace"
    ];

    const quickTips = [
        {
            title: "5-4-3-2-1 Grounding",
            description: "Notice 5 things you see, 4 things you hear, 3 things you feel, 2 things you smell, 1 thing you taste."
        },
        {
            title: "Progressive Muscle Relaxation",
            description: "Tense and release each muscle group starting from your toes up to your head."
        },
        {
            title: "Mindful Walking",
            description: "Take a slow walk, focusing on each step and your surroundings."
        },
        {
            title: "Gratitude Practice",
            description: "Think of three things you're grateful for right now."
        }
    ];

    return (
        <div className="page wellness-page">
            <h2>🧘 Wellness Activities</h2>

            <div className="breathing-exercise">
                <h3>Breathing Exercise</h3>
                <div className={`breathing-circle ${breathingActive ? 'active' : ''} ${breathingPhase}`}>
                    <div className="breathing-inner">
                        {!breathingActive ? (
                            <span>Click to Start</span>
                        ) : (
                            <span>{getPhaseInstruction()}</span>
                        )}
                    </div>
                </div>

                {breathingActive && (
                    <div className="breathing-stats">
                        <div className="stat">
                            <strong>Cycles:</strong> {breathingCount}
                        </div>
                        <div className="stat">
                            <strong>Time:</strong> {formatTime(sessionTime)}
                        </div>
                    </div>
                )}

                <div className="breathing-controls">
                    {!breathingActive ? (
                        <button onClick={startBreathing} className="btn btn-primary">
                            Start Breathing Exercise
                        </button>
                    ) : (
                        <button onClick={stopBreathing} className="btn btn-secondary">
                            Stop Exercise
                        </button>
                    )}
                </div>
            </div>

            <div className="affirmations-section">
                <h3>Daily Affirmations</h3>
                <div className="affirmations-grid">
                    {affirmations.map((affirmation, index) => (
                        <div key={index} className="affirmation-card">
                            <p>"{affirmation}"</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="quick-tips">
                <h3>Quick Wellness Tips</h3>
                <div className="tips-grid">
                    {quickTips.map((tip, index) => (
                        <div key={index} className="tip-card">
                            <h4>{tip.title}</h4>
                            <p>{tip.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Wellness;