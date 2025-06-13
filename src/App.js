import React, { useState, useRef, useEffect } from ‘react’;
import { BookOpen, RotateCcw, Trophy, Target, Star, Medal, Settings, Volume2, VolumeX, Zap, Crown, BarChart3, User, Calendar, Music, Play, Home, ArrowLeft, Clock, Users, Swords, TrendingUp, Share2, Timer, Gamepad2, Award, Flame, Shield, ChevronDown, ChevronUp, X } from ‘lucide-react’;

// Enhanced Confetti Effect
const ConfettiEffect = ({ active }) => {
if (!active) return null;

```
return (
    <div className="fixed inset-0 pointer-events-none z-50">
        {[...Array(30)].map((_, i) => (
            <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-bounce"
                style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][Math.floor(Math.random() * 6)],
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 2}s`,
                    transform: `scale(${0.5 + Math.random() * 1.5})`
                }}
            ></div>
        ))}
    </div>
);
```

};

const BookCricket = () => {
// Core state management
const [currentScreen, setCurrentScreen] = useState(‘home’);
const [selectedDifficulty, setSelectedDifficulty] = useState(‘medium’);
const [selectedMode, setSelectedMode] = useState(‘single’);
const [targetScore, setTargetScore] = useState(null);

```
// Game state
const [gameState, setGameState] = useState({
    currentPage: 1,
    totalPages: 500,
    score: 0,
    wickets: 0,
    ballsFaced: 0,
    isGameOver: false,
    lastDigit: null,
    runs: [],
    gameMode: 'single',
    targetScore: null,
    playerName: 'Player 1',
    difficulty: 'medium',
    streak: 0,
    maxStreak: 0,
    powerUps: {
        luckyPage: 0,
        doubleRuns: 0,
        extraLife: 0
    },
    activePowerUp: null,
    powerUpDuration: 0,
    timeLimit: null,
    startTime: null
});

// Enhanced UI state
const [showPowerUps, setShowPowerUps] = useState(false);
const [showStats, setShowStats] = useState(false);
const [showAchievements, setShowAchievements] = useState(false);
const [showSettings, setShowSettings] = useState(false);
const [showLeaderboard, setShowLeaderboard] = useState(false);
const [isAnimating, setIsAnimating] = useState(false);
const [celebration, setCelebration] = useState('');
const [audioEnabled, setAudioEnabled] = useState(false);

// Weather and progression
const [weatherSystem, setWeatherSystem] = useState({
    current: 'sunny',
    effects: true,
    intensity: 1.0
});

const [progressionSystem, setProgressionSystem] = useState({
    level: 1,
    xp: 0,
    skillPoints: 0
});

// User stats and achievements
const [userStats, setUserStats] = useState({
    totalRuns: 0,
    totalMatches: 0,
    totalWickets: 0,
    totalBalls: 0,
    totalSixes: 0,
    totalFours: 0,
    highestScore: 0,
    longestStreak: 0,
    averageScore: 0,
    strikeRate: 0,
    matchesWon: 0,
    achievementsUnlocked: 0,
    powerUpsUsed: 0,
    perfectGames: 0
});

const [achievements, setAchievements] = useState({
    firstSix: false,
    centurion: false,
    ballOfFire: false,
    survivor: false,
    chasemaster: false,
    streakking: false,
    quickfire: false,
    boundary: false,
    legend: false,
    nightmare: false,
    perfectGame: false,
    doublecentury: false
});

const [newAchievement, setNewAchievement] = useState('');
const [gameHistory, setGameHistory] = useState([]);
const [visualEffects, setVisualEffects] = useState({
    confetti: false,
    screenShake: false
});

// Audio context
const audioContextRef = useRef(null);
const gainNodeRef = useRef(null);

// Game configurations
const difficulties = {
    easy: {
        name: 'Easy',
        description: 'Only 0 & 9 are out',
        outDigits: [0, 9],
        scoreDigits: [1, 2, 3, 4, 6],
        color: 'emerald',
        icon: '🌱',
        multiplier: 1,
        powerUpChance: 0.15
    },
    medium: {
        name: 'Medium',
        description: 'Only 0 & 9 are out',
        outDigits: [0, 9],
        scoreDigits: [1, 2, 3, 4, 6],
        color: 'blue',
        icon: '⚡',
        multiplier: 1.2,
        powerUpChance: 0.10
    },
    hard: {
        name: 'Hard',
        description: '0, 5, 9 are out',
        outDigits: [0, 5, 9],
        scoreDigits: [1, 2, 3, 4, 6],
        color: 'orange',
        icon: '🔥',
        multiplier: 1.5,
        powerUpChance: 0.08
    },
    nightmare: {
        name: 'Nightmare',
        description: '0, 5, 7, 8, 9 are out',
        outDigits: [0, 5, 7, 8, 9],
        scoreDigits: [1, 2, 3, 4, 6],
        color: 'red',
        icon: '💀',
        multiplier: 2,
        powerUpChance: 0.05
    }
};

const gameModes = {
    single: { name: 'Single Player', description: 'Play until you get out', icon: '🏏' },
    chase: { name: 'Chase Target', description: 'Set a target score to chase', icon: '🎯' },
    timeAttack: { name: 'Time Attack', description: 'Score maximum in 2 minutes', icon: '⏱️' },
    survival: { name: 'Survival', description: 'Last as long as you can', icon: '🛡️' }
};

const powerUps = {
    luckyPage: {
        name: 'Lucky Page',
        description: 'Next page guaranteed to score',
        icon: '🍀',
        cost: 50,
        duration: 1
    },
    doubleRuns: {
        name: 'Double Runs',
        description: 'Double your runs for next 3 balls',
        icon: '💫',
        cost: 75,
        duration: 3
    },
    extraLife: {
        name: 'Extra Life',
        description: 'Survive one wicket',
        icon: '❤️',
        cost: 100,
        duration: 1
    }
};

const achievementDefs = {
    firstSix: { name: 'First Six!', desc: 'Hit your first six', icon: '🎯', points: 10 },
    centurion: { name: 'Centurion', desc: 'Score 100+ runs', icon: '💯', points: 50 },
    ballOfFire: { name: 'Ball of Fire', desc: 'Hit 3 sixes in a row', icon: '🔥', points: 75 },
    survivor: { name: 'Survivor', desc: 'Face 50+ balls without getting out', icon: '🛡️', points: 100 },
    chasemaster: { name: 'Chase Master', desc: 'Successfully chase 3 targets', icon: '🎯', points: 80 },
    streakking: { name: 'Streak King', desc: 'Score runs in 10 consecutive balls', icon: '⚡', points: 60 },
    quickfire: { name: 'Quickfire', desc: 'Score 50 runs in under 20 balls', icon: '💨', points: 90 },
    boundary: { name: 'Boundary King', desc: 'Hit 10 fours in a game', icon: '🏏', points: 70 },
    legend: { name: 'Legend', desc: 'Score 200+ runs', icon: '👑', points: 150 },
    nightmare: { name: 'Nightmare Survivor', desc: 'Score 25+ in nightmare mode', icon: '💀', points: 200 },
    perfectGame: { name: 'Perfect Game', desc: 'Score 50+ without getting out', icon: '✨', points: 250 },
    doublecentury: { name: 'Double Century', desc: 'Score 200+ runs in a single game', icon: '🏆', points: 300 }
};

const weatherTypes = {
    sunny: { name: 'Sunny', icon: '☀️', scoreMultiplier: 1.1, color: '#FFD700' },
    cloudy: { name: 'Cloudy', icon: '☁️', scoreMultiplier: 1.0, color: '#87CEEB' },
    rainy: { name: 'Rainy', icon: '🌧️', scoreMultiplier: 0.8, color: '#4682B4' },
    windy: { name: 'Windy', icon: '💨', scoreMultiplier: 0.9, color: '#B0C4DE' },
    stormy: { name: 'Stormy', icon: '⛈️', scoreMultiplier: 0.7, color: '#483D8B' }
};

// Audio functions
const initializeAudio = async () => {
    try {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            gainNodeRef.current = audioContextRef.current.createGain();
            gainNodeRef.current.connect(audioContextRef.current.destination);
            gainNodeRef.current.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
        }
        if (audioContextRef.current.state === 'suspended') {
            await audioContextRef.current.resume();
        }
    } catch (error) {
        console.log('Audio initialization failed:', error);
    }
};

const playSound = (type, runs = 0, isOut = false) => {
    if (!audioEnabled || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    if (isOut) {
        const wicketOsc = ctx.createOscillator();
        const wicketGain = ctx.createGain();
        wicketOsc.connect(wicketGain).connect(gainNodeRef.current);
        wicketOsc.type = 'triangle';
        wicketOsc.frequency.setValueAtTime(350, now);
        wicketOsc.frequency.exponentialRampToValueAtTime(200, now + 0.3);
        wicketGain.gain.setValueAtTime(0.4, now);
        wicketGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        wicketOsc.start(now);
        wicketOsc.stop(now + 0.4);
    } else if (runs === 6) {
        const sixOsc = ctx.createOscillator();
        const sixGain = ctx.createGain();
        sixOsc.connect(sixGain).connect(gainNodeRef.current);
        sixOsc.type = 'sine';
        sixOsc.frequency.setValueAtTime(523, now);
        sixOsc.frequency.exponentialRampToValueAtTime(440, now + 0.8);
        sixGain.gain.setValueAtTime(0.5, now);
        sixGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        sixOsc.start(now);
        sixOsc.stop(now + 1.2);
    } else if (runs === 4) {
        const fourOsc = ctx.createOscillator();
        const fourGain = ctx.createGain();
        fourOsc.connect(fourGain).connect(gainNodeRef.current);
        fourOsc.type = 'triangle';
        fourOsc.frequency.setValueAtTime(440, now);
        fourOsc.frequency.linearRampToValueAtTime(330, now + 0.4);
        fourGain.gain.setValueAtTime(0.4, now);
        fourGain.gain.linearRampToValueAtTime(0.001, now + 0.5);
        fourOsc.start(now);
        fourOsc.stop(now + 0.5);
    }
};

const enableAudio = async () => {
    await initializeAudio();
    setAudioEnabled(true);
};

// Game logic functions
const getScoreFromDigit = (digit) => {
    const diff = difficulties[gameState.difficulty];
    
    if (diff.outDigits.includes(digit)) {
        if (gameState.activePowerUp === 'extraLife' && gameState.powerUpDuration > 0) {
            setGameState(prev => ({ 
                ...prev, 
                activePowerUp: null,
                powerUpDuration: 0
            }));
            return { runs: 0, isOut: false, powerUpUsed: true };
        }
        return { runs: 0, isOut: true };
    }

    if (diff.scoreDigits.includes(digit)) {
        let runs = digit;
        if (gameState.activePowerUp === 'doubleRuns' && gameState.powerUpDuration > 0) {
            runs *= 2;
        }
        return { runs: runs, isOut: false };
    }

    return { runs: 0, isOut: false };
};

const activatePowerUp = (powerUpType) => {
    if (gameState.powerUps[powerUpType] <= 0 || gameState.activePowerUp || gameState.isGameOver) return;

    setGameState(prev => ({
        ...prev,
        powerUps: {
            ...prev.powerUps,
            [powerUpType]: prev.powerUps[powerUpType] - 1
        },
        activePowerUp: powerUpType,
        powerUpDuration: powerUps[powerUpType].duration
    }));

    setUserStats(prev => ({ ...prev, powerUpsUsed: prev.powerUpsUsed + 1 }));
    setCelebration(`✨ ${powerUps[powerUpType].name} activated! ✨`);
    setTimeout(() => setCelebration(''), 2000);
};

const turnPage = () => {
    if (gameState.isGameOver || isAnimating) return;

    setIsAnimating(true);

    let newPage = Math.floor(Math.random() * gameState.totalPages) + 1;
    let lastDigit = newPage % 10;

    // Apply lucky page power-up
    if (gameState.activePowerUp === 'luckyPage' && gameState.powerUpDuration > 0) {
        const luckyDigits = [1, 2, 3, 4, 6];
        lastDigit = luckyDigits[Math.floor(Math.random() * luckyDigits.length)];
        newPage = Math.floor(newPage / 10) * 10 + lastDigit;
    }

    const scoreResult = getScoreFromDigit(lastDigit);
    const weather = weatherSystem.current;
    const weatherMultiplier = weatherTypes[weather].scoreMultiplier;
    const finalRuns = Math.round(scoreResult.runs * weatherMultiplier);

    playSound('hit', finalRuns, scoreResult.isOut);

    // Enhanced celebration messages
    let celebrationMsg = '';
    if (scoreResult.isOut) {
        celebrationMsg = scoreResult.powerUpUsed ? '💖 Extra Life saved you!' : '💥 Clean bowled!';
    } else if (finalRuns === 6) {
        celebrationMsg = '🚀 MASSIVE SIX!';
        setVisualEffects(prev => ({ ...prev, confetti: true }));
        setTimeout(() => setVisualEffects(prev => ({ ...prev, confetti: false })), 3000);
    } else if (finalRuns === 4) {
        celebrationMsg = '🎯 BOUNDARY!';
    } else if (finalRuns > 0) {
        celebrationMsg = `⚡ ${finalRuns} runs!`;
    }

    if (celebrationMsg) {
        setCelebration(celebrationMsg);
        setTimeout(() => setCelebration(''), 2500);
    }

    const newScore = gameState.score + finalRuns;
    const newWickets = scoreResult.isOut ? gameState.wickets + 1 : gameState.wickets;
    const newBalls = gameState.ballsFaced + 1;
    const newStreak = finalRuns > 0 ? gameState.streak + 1 : 0;
    const newMaxStreak = Math.max(gameState.maxStreak, newStreak);

    // Update power-up duration
    let newPowerUpDuration = gameState.powerUpDuration;
    let newActivePowerUp = gameState.activePowerUp;
    
    if (gameState.activePowerUp && gameState.powerUpDuration > 0) {
        newPowerUpDuration = gameState.powerUpDuration - 1;
        if (newPowerUpDuration <= 0) {
            newActivePowerUp = null;
            newPowerUpDuration = 0;
        }
    }

    // Check game end conditions
    let isGameOver = newWickets >= 10;
    
    if (gameState.gameMode === 'timeAttack' && gameState.startTime) {
        const timeElapsed = (Date.now() - gameState.startTime) / 1000;
        if (timeElapsed >= 120) isGameOver = true;
    }
    
    if (gameState.gameMode === 'chase' && newScore > gameState.targetScore) {
        isGameOver = true;
    }

    // Generate power-ups
    const newPowerUps = { ...gameState.powerUps };
    if (Math.random() < difficulties[gameState.difficulty].powerUpChance && !isGameOver) {
        const powerUpTypes = Object.keys(powerUps);
        const randomPowerUp = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
        newPowerUps[randomPowerUp] += 1;
    }

    const newState = {
        ...gameState,
        currentPage: newPage,
        lastDigit: lastDigit,
        score: newScore,
        wickets: newWickets,
        ballsFaced: newBalls,
        isGameOver: isGameOver,
        streak: newStreak,
        maxStreak: newMaxStreak,
        powerUps: newPowerUps,
        activePowerUp: newActivePowerUp,
        powerUpDuration: newPowerUpDuration,
        runs: [...gameState.runs, { runs: finalRuns, isOut: scoreResult.isOut, page: newPage }]
    };

    setGameState(newState);
    checkAchievements(newState);
    updateStats(newState);

    if (isGameOver) {
        handleGameEnd(newState);
    }

    setTimeout(() => setIsAnimating(false), 800);
};

const handleGameEnd = (finalState) => {
    const newGame = {
        score: finalState.score,
        wickets: finalState.wickets,
        balls: finalState.ballsFaced,
        difficulty: finalState.difficulty,
        mode: finalState.gameMode,
        date: new Date().toLocaleDateString(),
        timestamp: Date.now()
    };

    setGameHistory(prev => [...prev, newGame]);
    setTimeout(() => setCurrentScreen('gameOver'), 1500);
};

const updateStats = (newState) => {
    if (!newState.isGameOver) return;

    setUserStats(prev => {
        const newStats = { ...prev };
        newStats.totalMatches += 1;
        newStats.totalRuns += newState.score;
        newStats.totalWickets += newState.wickets;
        newStats.totalBalls += newState.ballsFaced;
        newStats.highestScore = Math.max(newStats.highestScore, newState.score);
        newStats.longestStreak = Math.max(newStats.longestStreak, newState.maxStreak);
        newStats.averageScore = Math.round(newStats.totalRuns / newStats.totalMatches);
        newStats.strikeRate = Math.round((newStats.totalRuns / newStats.totalBalls) * 100);

        const sixes = newState.runs.filter(r => r.runs === 6).length;
        const fours = newState.runs.filter(r => r.runs === 4).length;
        newStats.totalSixes += sixes;
        newStats.totalFours += fours;

        if (newState.score >= 50 && newState.wickets === 0) {
            newStats.perfectGames += 1;
        }

        return newStats;
    });
};

const checkAchievements = (newState) => {
    const newAchievements = { ...achievements };
    let achievementUnlocked = false;

    if (!achievements.firstSix && newState.runs.some(r => r.runs === 6)) {
        newAchievements.firstSix = true;
        achievementUnlocked = 'firstSix';
    }
    if (!achievements.centurion && newState.score >= 100) {
        newAchievements.centurion = true;
        achievementUnlocked = 'centurion';
    }
    if (!achievements.legend && newState.score >= 200) {
        newAchievements.legend = true;
        achievementUnlocked = 'legend';
    }

    if (achievementUnlocked) {
        setAchievements(newAchievements);
        setNewAchievement(achievementUnlocked);
        setUserStats(prev => ({ ...prev, achievementsUnlocked: prev.achievementsUnlocked + 1 }));
        setTimeout(() => setNewAchievement(''), 4000);
    }
};

const startNewGame = () => {
    const startTime = selectedMode === 'timeAttack' ? Date.now() : null;
    
    setGameState({
        currentPage: 1,
        totalPages: 500,
        score: 0,
        wickets: 0,
        ballsFaced: 0,
        isGameOver: false,
        lastDigit: null,
        runs: [],
        gameMode: selectedMode,
        targetScore: selectedMode === 'chase' ? targetScore : null,
        playerName: 'Player 1',
        difficulty: selectedDifficulty,
        streak: 0,
        maxStreak: 0,
        powerUps: gameState.powerUps,
        activePowerUp: null,
        powerUpDuration: 0,
        timeLimit: selectedMode === 'timeAttack' ? 120 : null,
        startTime: startTime
    });

    setCelebration('');
    setCurrentScreen('game');
};

const resetGame = () => {
    startNewGame();
};

const goToHome = () => {
    setCurrentScreen('home');
    setGameState(prev => ({
        ...prev,
        isGameOver: false,
        score: 0,
        wickets: 0,
        ballsFaced: 0,
        runs: [],
        streak: 0
    }));
};

const achievementCount = Object.values(achievements).filter(Boolean).length;

// Modal Components
const StatsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-6 max-w-md w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                    Statistics
                </h2>
                <button onClick={() => setShowStats(false)} className="text-gray-500 hover:text-gray-700">
                    <X className="w-6 h-6" />
                </button>
            </div>
            
            <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-4">
                    <h3 className="font-bold text-blue-800 mb-3">Overall Performance</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-blue-600">{userStats.totalRuns}</div>
                            <div className="text-gray-600 text-sm">Total Runs</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-green-600">{userStats.totalMatches}</div>
                            <div className="text-gray-600 text-sm">Matches</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-orange-600">{userStats.highestScore}</div>
                            <div className="text-gray-600 text-sm">Best Score</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-purple-600">{userStats.averageScore}</div>
                            <div className="text-gray-600 text-sm">Average</div>
                        </div>
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-4">
                    <h3 className="font-bold text-green-800 mb-3">Batting Stats</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between bg-white rounded-lg p-2">
                            <span>Strike Rate:</span>
                            <span className="font-bold text-green-600">{userStats.strikeRate}%</span>
                        </div>
                        <div className="flex justify-between bg-white rounded-lg p-2">
                            <span>Total Boundaries:</span>
                            <span className="font-bold text-blue-600">{userStats.totalFours + userStats.totalSixes}</span>
                        </div>
                        <div className="flex justify-between bg-white rounded-lg p-2">
                            <span>Perfect Games:</span>
                            <span className="font-bold text-yellow-600">{userStats.perfectGames}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const AchievementsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-6 max-w-md w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Trophy className="w-8 h-8 text-yellow-500" />
                    <span className="text-gray-800">Achievements ({achievementCount}/12)</span>
                </h2>
                <button onClick={() => setShowAchievements(false)} className="text-gray-500 hover:text-gray-700">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="mb-6">
                <div className="bg-gray-200 rounded-full h-4">
                    <div 
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 h-4 rounded-full transition-all duration-1000"
                        style={{ width: `${(achievementCount / 12) * 100}%` }}
                    ></div>
                </div>
                <div className="text-center text-sm text-gray-600 mt-2">
                    {Math.round((achievementCount / 12) * 100)}% Complete
                </div>
            </div>

            <div className="space-y-3">
                {Object.entries(achievementDefs).map(([key, achievement]) => (
                    <div key={key} className={`p-4 rounded-2xl border-2 transition-all ${
                        achievements[key] 
                            ? 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50' 
                            : 'border-gray-200 bg-gray-50 opacity-60'
                    }`}>
                        <div className="flex items-center gap-4">
                            <div className="text-3xl">{achievement.icon}</div>
                            <div className="flex-1">
                                <div className="font-bold text-gray-800">{achievement.name}</div>
                                <div className="text-sm text-gray-600">{achievement.desc}</div>
                                {achievements[key] && (
                                    <div className="text-xs text-green-600 font-semibold mt-1">✅ UNLOCKED!</div>
                                )}
                            </div>
                            {achievements[key] && (
                                <Medal className="w-6 h-6 text-yellow-500" />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const SettingsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-6 max-w-md w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Settings className="w-8 h-8 text-gray-600" />
                    <span className="text-gray-800">Settings</span>
                </h2>
                <button onClick={() => setShowSettings(false)} className="text-gray-500 hover:text-gray-700">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-4">
                    <h3 className="font-bold text-blue-800 mb-4">🔊 Audio Settings</h3>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-700">Sound Effects</span>
                        <button
                            onClick={audioEnabled ? () => setAudioEnabled(false) : enableAudio}
                            className={`p-3 rounded-full transition-all ${
                                audioEnabled ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                            }`}
                        >
                            {audioEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-4">
                    <h3 className="font-bold text-green-800 mb-4">🎮 Game Preferences</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 mb-2">Default Difficulty</label>
                            <select
                                value={selectedDifficulty}
                                onChange={(e) => setSelectedDifficulty(e.target.value)}
                                className="w-full p-3 rounded-lg border-2 border-green-300 focus:border-green-500 focus:outline-none"
                            >
                                {Object.entries(difficulties).map(([key, diff]) => (
                                    <option key={key} value={key}>{diff.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// Main render logic
if (currentScreen === 'home') {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
            <ConfettiEffect active={visualEffects.confetti} />
            
            <div className="max-w-md mx-auto">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Clean Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white text-center">
                        <BookOpen className="w-12 h-12 mx-auto mb-3" />
                        <h1 className="text-3xl font-bold mb-2">Book Cricket Pro</h1>
                        <p className="text-blue-100">Relive your school days! 📚</p>
                        
                        {/* Quick stats */}
                        <div className="flex justify-center gap-4 mt-4">
                            <div className="text-center">
                                <div className="text-xl font-bold text-yellow-300">{userStats.highestScore}</div>
                                <div className="text-xs text-blue-100">Best Score</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-bold text-yellow-300">{achievementCount}/12</div>
                                <div className="text-xs text-blue-100">Achievements</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-bold text-yellow-300">{userStats.totalMatches}</div>
                                <div className="text-xs text-blue-100">Games</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Difficulty Selection */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Choose Difficulty</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.entries(difficulties).map(([key, diff]) => (
                                    <button
                                        key={key}
                                        onClick={() => setSelectedDifficulty(key)}
                                        className={`p-4 rounded-2xl border-2 text-center transition-all transform hover:scale-105 ${
                                            selectedDifficulty === key
                                                ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                                                : 'border-gray-200 bg-white hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="text-2xl mb-2">{diff.icon}</div>
                                        <div className="font-bold">{diff.name}</div>
                                        <div className="text-xs text-gray-600">{diff.description}</div>
                                        <div className="text-xs text-purple-600 font-semibold mt-1">×{diff.multiplier} points</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Game Mode Selection */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Game Mode</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.entries(gameModes).map(([key, mode]) => (
                                    <button
                                        key={key}
                                        onClick={() => setSelectedMode(key)}
                                        className={`p-3 rounded-2xl border-2 text-center transition-all transform hover:scale-105 ${
                                            selectedMode === key
                                                ? 'border-green-500 bg-green-50 shadow-lg'
                                                : 'border-gray-200 bg-white hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="text-xl mb-2">{mode.icon}</div>
                                        <div className="font-bold text-sm">{mode.name}</div>
                                        <div className="text-xs text-gray-600">{mode.description}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Chase Target Input */}
                        {selectedMode === 'chase' && (
                            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 border-2 border-yellow-300">
                                <h4 className="font-bold text-orange-800 mb-3 text-center">🎯 Set Target Score</h4>
                                <input
                                    type="number"
                                    value={targetScore || ''}
                                    onChange={(e) => setTargetScore(parseInt(e.target.value) || null)}
                                    placeholder="Enter target score..."
                                    className="w-full p-3 rounded-xl border-2 border-orange-300 text-center text-xl font-bold focus:border-orange-500 focus:outline-none"
                                    min="1"
                                    max="500"
                                />
                            </div>
                        )}

                        {/* Power-ups Display (Collapsible) */}
                        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 border-2 border-purple-300">
                            <button
                                onClick={() => setShowPowerUps(!showPowerUps)}
                                className="w-full flex items-center justify-between"
                            >
                                <h4 className="font-bold text-purple-800">🎁 Your Power-ups</h4>
                                {showPowerUps ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>
                            
                            {showPowerUps && (
                                <div className="mt-4 grid grid-cols-3 gap-3">
                                    {Object.entries(powerUps).map(([key, powerUp]) => (
                                        <div key={key} className="bg-white rounded-lg p-2 text-center">
                                            <div className="text-xl">{powerUp.icon}</div>
                                            <div className="text-xs font-bold">{powerUp.name}</div>
                                            <div className="text-lg font-bold text-purple-600">{gameState.powerUps[key] || 0}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Start Game Button */}
                        <button
                            onClick={startNewGame}
                            disabled={selectedMode === 'chase' && !targetScore}
                            className={`w-full py-4 rounded-2xl font-bold text-xl transition-all duration-300 transform shadow-lg ${
                                selectedMode === 'chase' && !targetScore
                                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 hover:scale-105'
                            }`}
                        >
                            <Play className="w-6 h-6 inline mr-2" />
                            Start New Game
                        </button>

                        {/* Quick Access Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setShowStats(true)}
                                className="py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2"
                            >
                                <BarChart3 className="w-4 h-4" />
                                Statistics
                            </button>
                            <button
                                onClick={() => setShowAchievements(true)}
                                className="py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-bold hover:from-yellow-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2"
                            >
                                <Trophy className="w-4 h-4" />
                                Achievements
                            </button>
                        </div>

                        <button
                            onClick={() => setShowSettings(true)}
                            className="w-full py-3 bg-gradient-to-r from-gray-500 to-blue-500 text-white rounded-xl font-bold hover:from-gray-600 hover:to-blue-600 transition-all flex items-center justify-center gap-2"
                        >
                            <Settings className="w-4 h-4" />
                            Settings
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showStats && <StatsModal />}
            {showAchievements && <AchievementsModal />}
            {showSettings && <SettingsModal />}
        </div>
    );
}

if (currentScreen === 'gameOver') {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
            <div className="max-w-md mx-auto">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-red-600 p-6 text-white text-center">
                        <Crown className="w-12 h-12 mx-auto mb-3 text-yellow-300" />
                        <h1 className="text-3xl font-bold mb-2">🏏 Match Complete! 🏏</h1>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Final Score */}
                        <div className="text-center bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6">
                            <div className="text-5xl font-bold text-blue-600 mb-3">
                                {gameState.score}/{gameState.wickets}
                            </div>
                            <div className="text-lg text-gray-700 mb-3">
                                {gameState.gameMode === 'chase' && gameState.score > gameState.targetScore
                                    ? `🎉 Target chased successfully! 🎉`
                                    : gameState.gameMode === 'chase' && gameState.wickets >= 10
                                        ? `💔 Fell short by ${gameState.targetScore - gameState.score} runs 💔`
                                        : gameState.gameMode === 'timeAttack'
                                            ? `⏱️ Time Attack Complete!`
                                            : `🏏 Final Score in ${gameState.ballsFaced} balls`
                                }
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                                <div>Strike Rate: {gameState.ballsFaced > 0 ? Math.round((gameState.score / gameState.ballsFaced) * 100) : 0}%</div>
                                <div>Best Streak: {gameState.maxStreak} balls</div>
                                <div>Boundaries: {gameState.runs.filter(r => r.runs >= 4 && !r.isOut).length}</div>
                            </div>
                        </div>

                        {/* New Achievement */}
                        {newAchievement && (
                            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 border-2 border-yellow-300 text-center">
                                <div className="text-3xl mb-2">{achievementDefs[newAchievement].icon}</div>
                                <div className="font-bold text-orange-800 text-lg">🎉 NEW ACHIEVEMENT! 🎉</div>
                                <div className="font-bold text-gray-700">{achievementDefs[newAchievement].name}</div>
                                <div className="text-sm text-gray-600">{achievementDefs[newAchievement].desc}</div>
                            </div>
                        )}

                        {/* Performance Stats */}
                        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-4">
                            <h3 className="font-bold text-green-800 mb-3 text-center">📊 Performance Analysis</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white rounded-lg p-3 text-center">
                                    <div className="text-2xl font-bold text-blue-600">{gameState.runs.filter(r => r.runs === 6).length}</div>
                                    <div className="text-gray-600 text-sm">Sixes</div>
                                </div>
                                <div className="bg-white rounded-lg p-3 text-center">
                                    <div className="text-2xl font-bold text-green-600">{gameState.runs.filter(r => r.runs === 4).length}</div>
                                    <div className="text-gray-600 text-sm">Fours</div>
                                </div>
                                <div className="bg-white rounded-lg p-3 text-center">
                                    <div className="text-2xl font-bold text-orange-600">{gameState.runs.filter(r => r.runs === 0 && !r.isOut).length}</div>
                                    <div className="text-gray-600 text-sm">Dots</div>
                                </div>
                                <div className="bg-white rounded-lg p-3 text-center">
                                    <div className="text-2xl font-bold text-purple-600">{userStats.powerUpsUsed}</div>
                                    <div className="text-gray-600 text-sm">Power-ups</div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={resetGame}
                                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-bold hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center gap-3"
                            >
                                <RotateCcw className="w-5 h-5" />
                                Play Again
                            </button>

                            <button
                                onClick={goToHome}
                                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-bold hover:from-blue-600 hover:to-purple-600 transition-all flex items-center justify-center gap-3"
                            >
                                <Home className="w-5 h-5" />
                                Back to Menu
                            </button>
                        </div>

                        {/* Recent Performance */}
                        {gameState.runs.length > 0 && (
                            <div className="bg-gradient-to-r from-gray-100 to-blue-100 rounded-2xl p-4">
                                <h3 className="font-bold text-gray-700 mb-3 text-center">🏏 Ball by Ball</h3>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {gameState.runs.slice(-12).map((run, index) => (
                                        <span
                                            key={index}
                                            className={`px-3 py-2 rounded-full text-sm font-bold shadow-md ${
                                                run.isOut
                                                    ? 'bg-gradient-to-r from-red-400 to-red-600 text-white'
                                                    : run.runs >= 6
                                                        ? 'bg-gradient-to-r from-purple-400 to-pink-500 text-white'
                                                        : run.runs >= 4
                                                            ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                                                            : run.runs >= 1
                                                                ? 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white'
                                                                : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                                            }`}
                                        >
                                            {run.isOut ? 'OUT' : run.runs === 0 ? '•' : run.runs}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Game Screen
return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
        <ConfettiEffect active={visualEffects.confetti} />
        
        <div className="max-w-md mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Clean Game Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-6 h-6" />
                            <div>
                                <h1 className="text-lg font-bold">Book Cricket Pro</h1>
                                <div className="text-sm text-blue-100">
                                    {gameState.gameMode === 'timeAttack' ? '⏱️ Time Attack' :
                                     gameState.gameMode === 'survival' ? '🛡️ Survival' :
                                     gameState.gameMode === 'chase' ? '🎯 Chase Mode' :
                                     '🏏 Single Player'}
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowStats(true)}
                                className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all"
                            >
                                <BarChart3 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={goToHome}
                                className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all"
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Game Info Bar */}
                    <div className="mt-3 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full">
                                {difficulties[gameState.difficulty].name}
                            </span>
                            <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full">
                                {weatherTypes[weatherSystem.current].icon} {weatherTypes[weatherSystem.current].name}
                            </span>
                        </div>
                        
                        {gameState.gameMode === 'timeAttack' && gameState.startTime && (
                            <span className="bg-red-500 px-2 py-1 rounded-full font-bold">
                                ⏰ {Math.max(0, 120 - Math.floor((Date.now() - gameState.startTime) / 1000))}s
                            </span>
                        )}
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Score Display */}
                    <div className="text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-2">
                            {gameState.score}/{gameState.wickets}
                        </div>
                        <div className="flex justify-center gap-4 text-sm text-gray-600">
                            <span>Balls: {gameState.ballsFaced}</span>
                            <span>Streak: {gameState.streak}</span>
                            <span>Best: {gameState.maxStreak}</span>
                        </div>
                        
                        {gameState.gameMode === 'chase' && gameState.targetScore && (
                            <div className="mt-3 bg-gradient-to-r from-red-500 to-red-700 text-white font-bold rounded-lg p-3">
                                🎯 TARGET: {gameState.targetScore} | NEED: {Math.max(0, gameState.targetScore - gameState.score + 1)} runs
                            </div>
                        )}
                    </div>

                    {/* Celebration Message */}
                    {celebration && (
                        <div className="text-center">
                            <div className="text-xl font-bold text-transparent bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 bg-clip-text animate-pulse">
                                {celebration}
                            </div>
                        </div>
                    )}

                    {/* Current Page Display */}
                    <div className={`bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl p-6 text-white text-center transform transition-all duration-700 ${
                        isAnimating ? 'scale-110 rotate-2' : 'scale-100 rotate-0'
                    }`}>
                        <div className="text-sm opacity-90 mb-2">📖 Current Page</div>
                        <div className={`text-4xl font-bold mb-2 transition-all duration-700 ${
                            isAnimating ? 'scale-150 text-yellow-300' : 'scale-100'
                        }`}>
                            {gameState.currentPage || '---'}
                        </div>
                        {gameState.lastDigit !== null && (
                            <div className="text-sm opacity-90">
                                Last digit: <span className="font-bold text-xl text-yellow-300">{gameState.lastDigit}</span>
                            </div>
                        )}
                    </div>

                    {/* Power-ups (Only show if available) */}
                    {(Object.values(gameState.powerUps).some(count => count > 0) || gameState.activePowerUp) && (
                        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 border-2 border-purple-300">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-bold text-purple-800">🎁 Power-ups</h4>
                                {gameState.activePowerUp && (
                                    <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
                                        {powerUps[gameState.activePowerUp]?.name} ({gameState.powerUpDuration} left)
                                    </span>
                                )}
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {Object.entries(powerUps).map(([key, powerUp]) => (
                                    <button
                                        key={key}
                                        onClick={() => activatePowerUp(key)}
                                        disabled={gameState.powerUps[key] <= 0 || gameState.activePowerUp || gameState.isGameOver}
                                        className={`p-2 rounded-lg text-center transition-all ${
                                            gameState.activePowerUp === key ? 'bg-yellow-300 text-yellow-800 border-2 border-yellow-500' :
                                            gameState.powerUps[key] > 0 ? 'bg-white text-purple-700 hover:bg-purple-50 cursor-pointer border-2 border-purple-200' :
                                            'bg-gray-200 text-gray-500 cursor-not-allowed opacity-50'
                                        }`}
                                    >
                                        <div className="text-lg">{powerUp.icon}</div>
                                        <div className="text-xs font-bold">{gameState.powerUps[key] || 0}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Turn Page Button */}
                    <button
                        onClick={turnPage}
                        disabled={gameState.isGameOver || isAnimating}
                        className={`w-full py-4 rounded-2xl font-bold text-xl transition-all duration-300 transform shadow-lg ${
                            gameState.isGameOver || isAnimating
                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 hover:scale-105 active:scale-95'
                        } ${isAnimating ? 'animate-pulse' : ''}`}
                    >
                        {gameState.isGameOver ? '🏁 Game Complete!' : 
                         isAnimating ? '📖 Turning Page...' : 
                         '📖 Turn the Page'}
                    </button>

                    {/* Recent Performance (Compact) */}
                    {gameState.runs.length > 0 && (
                        <div className="bg-gradient-to-r from-gray-100 to-blue-100 rounded-2xl p-4">
                            <h3 className="font-bold text-gray-700 mb-3 text-center">📊 Recent Balls</h3>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {gameState.runs.slice(-8).map((run, index) => (
                                    <span
                                        key={index}
                                        className={`px-2 py-1 rounded-full text-sm font-bold ${
                                            run.isOut
                                                ? 'bg-red-500 text-white'
                                                : run.runs >= 6
                                                    ? 'bg-purple-500 text-white'
                                                    : run.runs >= 4
                                                        ? 'bg-green-500 text-white'
                                                        : run.runs >= 1
                                                            ? 'bg-blue-500 text-white'
                                                            : 'bg-gray-500 text-white'
                                        }`}
                                    >
                                        {run.isOut ? 'OUT' : run.runs === 0 ? '•' : run.runs}
                                    </span>
                                ))}
                            </div>
                            <div className="mt-2 text-xs text-gray-600 text-center">
                                Boundaries: {gameState.runs.filter(r => r.runs >= 4 && !r.isOut).length} | 
                                Strike Rate: {gameState.ballsFaced > 0 ? Math.round((gameState.score / gameState.ballsFaced) * 100) : 0}%
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Modals for game screen */}
        {showStats && <StatsModal />}
    </div>
);
```

};

export default BookCricket;
