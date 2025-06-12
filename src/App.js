import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, RotateCcw, Trophy, Target, Star, Medal, Settings, Volume2, VolumeX, Zap, Crown, BarChart3, User, Calendar, Music, Play, Home, ArrowLeft, Clock, Users, Swords, TrendingUp, Share2, Timer, Gamepad2, Award, Flame, Shield } from 'lucide-react';

// Add this component before your main BookCricket component
const ConfettiEffect = ({ active }) => {
    if (!active) return null;

    return (
        <div className="confetti-effect">
            {[...Array(50)].map((_, i) => (
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
};

const BookCricket = () => {
    // App state management
    const [currentScreen, setCurrentScreen] = useState('home'); // 'home', 'game', 'gameOver', 'tournament', 'multiplayer'
    const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
    const [selectedMode, setSelectedMode] = useState('single');
    const [targetScore, setTargetScore] = useState(null);

    // Add this CSS styles component at the top of your component:
    const enhancedStyles = `
  .weather-rain {
    background: linear-gradient(transparent 40%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.1) 60%, transparent 60%);
    background-size: 2px 10px;
    animation: rain 0.5s linear infinite;
  }
  
  .weather-lightning {
    animation: lightning 0.1s ease-in-out;
  }
  
  .confetti-effect {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1000;
  }
  
  @keyframes rain {
    0% { background-position: 0 0; }
    100% { background-position: 0 10px; }
  }
  
  @keyframes lightning {
    0%, 100% { background-color: rgba(255,255,255,0); }
    50% { background-color: rgba(255,255,255,0.8); }
  }
  
  @keyframes shake {
    0%, 20%, 40%, 60%, 80%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  }
  
  .page-flip-3d {
    transform-style: preserve-3d;
    transition: transform 0.8s ease-in-out;
  }
  
  .page-flip-3d.flipping {
    transform: rotateY(180deg);
  }
`;

    // Enhanced game state
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
        timeLimit: null,
        startTime: null
    });

    // New features state
    const [tournamentData, setTournamentData] = useState({
        currentRound: 0,
        totalRounds: 0,
        bracket: [],
        isActive: false,
        winner: null
    });

    const [multiplayerData, setMultiplayerData] = useState({
        isActive: false,
        currentPlayer: 1,
        players: [
            { name: 'Player 1', score: 0, wickets: 0, balls: 0, isOut: false },
            { name: 'Player 2', score: 0, wickets: 0, balls: 0, isOut: false }
        ],
        gameComplete: false,
        winner: null
    });

    const [dailyChallenge, setDailyChallenge] = useState({
        active: true,
        description: "Score 75+ runs in nightmare mode",
        progress: 0,
        target: 75,
        reward: "🎯 Master Badge",
        completed: false,
        expiresIn: "18:45:22"
    });

    const [leaderboard, setLeaderboard] = useState([
        { name: 'Cricket Legend', score: 287, difficulty: 'nightmare', date: '2024-03-15' },
        { name: 'Boundary King', score: 245, difficulty: 'hard', date: '2024-03-14' },
        { name: 'Six Master', score: 198, difficulty: 'medium', date: '2024-03-13' },
        { name: 'The Wall', score: 156, difficulty: 'hard', date: '2024-03-12' },
        { name: 'Quick Fire', score: 134, difficulty: 'medium', date: '2024-03-11' }
    ]);

    // Add these new state variables after your existing ones
    const [weatherSystem, setWeatherSystem] = useState({
        current: 'sunny', // sunny, cloudy, rainy, windy, stormy
        effects: true,
        intensity: 1.0,
        lastChanged: Date.now(),
        forecast: []
    });

    const [commentarySystem, setCommentarySystem] = useState({
        enabled: true,
        history: [],
        currentComment: '',
        voiceEnabled: false,
        mood: 'neutral' // excited, calm, tense, disappointed
    });

    const [visualEffects, setVisualEffects] = useState({
        particles: true,
        screenShake: true,
        slowMotion: false,
        confetti: false,
        weatherEffects: true
    });

    const [progressionSystem, setProgressionSystem] = useState({
        level: 1,
        xp: 0,
        skillPoints: 0,
        equipment: {
            bat: { name: 'Basic Bat', bonus: 0 },
            gloves: { name: 'Basic Gloves', bonus: 0 },
            helmet: { name: 'Basic Helmet', bonus: 0 }
        },
        currentBook: 'classic',
        unlockedBooks: ['classic']
    });

    const [enhancedAudio, setEnhancedAudio] = useState({
        masterVolume: 0.7,
        sfxVolume: 0.8,
        musicVolume: 0.6,
        weatherVolume: 0.5,
        commentaryVolume: 0.7,
        hapticEnabled: true
    });

    // Existing state
    const [showRules, setShowRules] = useState(false);
    const [showAchievements, setShowAchievements] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [gameHistory, setGameHistory] = useState([]);
    const [celebration, setCelebration] = useState('');

    const [achievements, setAchievements] = useState({
        firstSix: false, centurion: false, ballOfFire: false, survivor: false,
        chasemaster: false, streakking: false, quickfire: false, boundary: false,
        legend: false, nightmare: false, perfectGame: false, doublecentury: false,
        // New achievements
        speedster: false, multiWin: false, tournamentChamp: false, socialShare: false
    });

    const [newAchievement, setNewAchievement] = useState('');
    const [audioEnabled, setAudioEnabled] = useState(false);
    const [backgroundMusicEnabled, setBgMusicEnabled] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // Enhanced user stats
    const [userStats, setUserStats] = useState({
        totalRuns: 0, totalMatches: 0, totalWickets: 0, totalBalls: 0,
        totalSixes: 0, totalFours: 0, highestScore: 0, longestStreak: 0,
        averageScore: 0, strikeRate: 0, matchesWon: 0, achievementsUnlocked: 0,
        timePlayedMinutes: 0, favoriteDigit: null, lastPlayedDate: null,
        weeklyGoal: 500, weeklyProgress: 0,
        // New stats
        fastestFifty: null, tournamentWins: 0, multiplayerWins: 0,
        challengesCompleted: 0, powerUpsUsed: 0, perfectGames: 0
    });

    const [persistentMusicEnabled, setPersistentMusicEnabled] = useState(false);
    const persistentMusicRef = useRef(null);
    const persistentGainRef = useRef(null);

    // Audio refs
    const audioContextRef = useRef(null);
    const gainNodeRef = useRef(null);
    const bgMusicOscillatorRef = useRef(null);
    const bgMusicGainRef = useRef(null);
    const bgMusicIntervalRef = useRef(null);

    // Enhanced difficulty settings
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

    // Enhanced game modes
    const gameModes = {
        single: {
            name: 'Single Player',
            description: 'Play until you get out',
            icon: '🏏'
        },
        chase: {
            name: 'Chase Target',
            description: 'Set a target score to chase',
            icon: '🎯'
        },
        timeAttack: {
            name: 'Time Attack',
            description: 'Score maximum in 2 minutes',
            icon: '⏱️'
        },
        t5: {
            name: 'T5 Cricket',
            description: '5 overs (30 balls)',
            icon: '⚡'
        },
        t10: {
            name: 'T10 Cricket',
            description: '10 overs (60 balls)',
            icon: '🔥'
        },
        t20: {
            name: 'T20 Cricket',
            description: '20 overs (120 balls)',
            icon: '🏆'
        },
        multiplayer: {
            name: 'Local Multiplayer',
            description: 'Turn-based with friends',
            icon: '👥'
        },
        tournament: {
            name: 'Tournament',
            description: 'Bracket-style competition',
            icon: '🏆'
        }
    };

    // Enhanced achievement definitions
    const achievementDefs = {
        firstSix: { name: 'First Six!', desc: 'Hit your first six', icon: '🎯', color: 'emerald', points: 10 },
        centurion: { name: 'Centurion', desc: 'Score 100+ runs', icon: '💯', color: 'blue', points: 50 },
        ballOfFire: { name: 'Ball of Fire', desc: 'Hit 3 sixes in a row', icon: '🔥', color: 'orange', points: 75 },
        survivor: { name: 'Survivor', desc: 'Face 50+ balls without getting out', icon: '🛡️', color: 'purple', points: 100 },
        chasemaster: { name: 'Chase Master', desc: 'Successfully chase 3 targets', icon: '🎯', color: 'red', points: 80 },
        streakking: { name: 'Streak King', desc: 'Score runs in 10 consecutive balls', icon: '⚡', color: 'yellow', points: 60 },
        quickfire: { name: 'Quickfire', desc: 'Score 50 runs in under 20 balls', icon: '💨', color: 'cyan', points: 90 },
        boundary: { name: 'Boundary King', desc: 'Hit 10 fours in a game', icon: '🏏', color: 'indigo', points: 70 },
        legend: { name: 'Legend', desc: 'Score 200+ runs', icon: '👑', color: 'yellow', points: 150 },
        nightmare: { name: 'Nightmare Survivor', desc: 'Score 25+ in nightmare mode', icon: '💀', color: 'gray', points: 200 },
        perfectGame: { name: 'Perfect Game', desc: 'Score 50+ without getting out', icon: '✨', color: 'gold', points: 250 },
        doublecentury: { name: 'Double Century', desc: 'Score 200+ runs in a single game', icon: '🏆', color: 'gold', points: 300 },
        // New achievements
        speedster: { name: 'Speedster', desc: 'Score 50+ in time attack mode', icon: '💨', color: 'cyan', points: 120 },
        multiWin: { name: 'Multiplayer Master', desc: 'Win 5 multiplayer games', icon: '👥', color: 'purple', points: 150 },
        tournamentChamp: { name: 'Tournament Champion', desc: 'Win a tournament', icon: '🏆', color: 'gold', points: 200 },
        socialShare: { name: 'Social Star', desc: 'Share your first score', icon: '📱', color: 'pink', points: 25 }
    };

    // Enhanced power-ups - replace your existing powerUps object
    const enhancedPowerUps = {
        luckyPage: {
            name: 'Lucky Page',
            description: 'Next page guaranteed to be a scoring digit',
            icon: '🍀',
            cost: 50,
            effect: 'Forces next digit to be 1-6',
            suggestion: 'Use when you need a guaranteed score',
            rarity: 'common'
        },
        doubleRuns: {
            name: 'Double Runs',
            description: 'Double your runs for next 3 balls',
            icon: '💫',
            cost: 75,
            effect: 'Multiplies runs by 2 for 3 balls',
            suggestion: 'Best used in good weather conditions',
            rarity: 'uncommon'
        },
        extraLife: {
            name: 'Extra Life',
            description: 'Survive one wicket',
            icon: '❤️',
            cost: 100,
            effect: 'Prevents one out',
            suggestion: 'Save for crucial moments',
            rarity: 'rare'
        },
        weatherControl: {
            name: 'Weather Control',
            description: 'Change weather to sunny for 5 balls',
            icon: '🌤️',
            cost: 120,
            effect: 'Forces sunny weather temporarily',
            suggestion: 'Use in poor weather conditions',
            rarity: 'rare'
        },
        sixStrike: {
            name: 'Six Strike',
            description: 'Next scoring ball becomes a six',
            icon: '⚡',
            cost: 150,
            effect: 'Converts next run to 6',
            suggestion: 'Combine with double runs for maximum effect',
            rarity: 'epic'
        },
        timeFreeze: {
            name: 'Time Freeze',
            description: 'Pause timer for 10 seconds in time attack',
            icon: '⏸️',
            cost: 80,
            effect: 'Pauses time attack timer',
            suggestion: 'Only useful in time attack mode',
            rarity: 'uncommon'
        },
        perfectPitch: {
            name: 'Perfect Pitch',
            description: 'Next 3 balls cannot be out',
            icon: '🎯',
            cost: 200,
            effect: 'Guaranteed safe batting',
            suggestion: 'Use when wickets are low',
            rarity: 'legendary'
        }
    };

    // Add after your difficulties object
    const weatherTypes = {
        sunny: {
            name: 'Sunny',
            icon: '☀️',
            description: 'Perfect batting conditions',
            scoreMultiplier: 1.1,
            powerUpChance: 1.0,
            color: '#FFD700',
            effects: ['bright', 'clear']
        },
        cloudy: {
            name: 'Cloudy',
            icon: '☁️',
            description: 'Good for both batting and bowling',
            scoreMultiplier: 1.0,
            powerUpChance: 1.0,
            color: '#87CEEB',
            effects: ['overcast']
        },
        rainy: {
            name: 'Rainy',
            icon: '🌧️',
            description: 'Difficult batting conditions',
            scoreMultiplier: 0.8,
            powerUpChance: 1.2,
            color: '#4682B4',
            effects: ['rain', 'slippery']
        },
        windy: {
            name: 'Windy',
            icon: '💨',
            description: 'Unpredictable ball movement',
            scoreMultiplier: 0.9,
            powerUpChance: 1.1,
            color: '#B0C4DE',
            effects: ['wind', 'movement']
        },
        stormy: {
            name: 'Stormy',
            icon: '⛈️',
            description: 'Extreme conditions - high risk, high reward',
            scoreMultiplier: 0.7,
            powerUpChance: 1.5,
            color: '#483D8B',
            effects: ['lightning', 'thunder', 'heavy_rain']
        }
    };

    // Progression and Equipment System
    const equipmentLibrary = {
        bats: {
            basic: { name: 'Basic Bat', bonus: 0, unlockLevel: 1 },
            willow: { name: 'English Willow', bonus: 0.1, unlockLevel: 5 },
            kashmir: { name: 'Kashmir Willow', bonus: 0.15, unlockLevel: 10 },
            carbon: { name: 'Carbon Fiber', bonus: 0.2, unlockLevel: 20 },
            legendary: { name: 'Legendary Blade', bonus: 0.3, unlockLevel: 50 }
        },
        gloves: {
            basic: { name: 'Basic Gloves', bonus: 0, unlockLevel: 1 },
            leather: { name: 'Leather Gloves', bonus: 0.05, unlockLevel: 3 },
            pro: { name: 'Pro Gloves', bonus: 0.1, unlockLevel: 8 },
            elite: { name: 'Elite Gloves', bonus: 0.15, unlockLevel: 15 }
        },
        helmets: {
            basic: { name: 'Basic Helmet', bonus: 0, unlockLevel: 1 },
            titanium: { name: 'Titanium Helmet', bonus: 0.08, unlockLevel: 7 },
            smart: { name: 'Smart Helmet', bonus: 0.12, unlockLevel: 12 }
        }
    };

    const bookLibrary = {
        classic: {
            name: 'Classic Novel',
            pages: 500,
            description: 'The original book cricket experience',
            bonus: 1.0,
            unlockLevel: 1
        },
        dictionary: {
            name: 'Dictionary',
            pages: 1000,
            description: 'More pages, more possibilities',
            bonus: 1.1,
            unlockLevel: 5
        },
        encyclopedia: {
            name: 'Encyclopedia',
            pages: 2000,
            description: 'Vast knowledge, vast scoring',
            bonus: 1.2,
            unlockLevel: 15
        },
        manual: {
            name: 'Technical Manual',
            pages: 300,
            description: 'Precise and calculated',
            bonus: 0.9,
            specialEffect: 'Higher power-up chance',
            unlockLevel: 10
        }
    };

    // Audio initialization (keeping existing audio code)
    const initializeAudio = async () => {
        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
                gainNodeRef.current = audioContextRef.current.createGain();
                gainNodeRef.current.connect(audioContextRef.current.destination);
                gainNodeRef.current.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);

                bgMusicGainRef.current = audioContextRef.current.createGain();
                bgMusicGainRef.current.connect(audioContextRef.current.destination);
                bgMusicGainRef.current.gain.setValueAtTime(0.2, audioContextRef.current.currentTime);
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
            // Wicket sound
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
            // Six sound
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
            // Four sound
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

    // Enhanced audio system - add this after your existing audio functions
    const playEnhancedSound = (type, runs = 0, isOut = false) => {
        if (!audioEnabled || !audioContextRef.current) return;

        const ctx = audioContextRef.current;
        const now = ctx.currentTime;
        const weather = weatherSystem.current;

        // Apply weather effects to audio
        const weatherMod = weatherTypes[weather].scoreMultiplier;
        const volume = enhancedAudio.sfxVolume * enhancedAudio.masterVolume * weatherMod;

        if (isOut) {
            // Enhanced wicket sound with harmonics
            const wicketOsc = ctx.createOscillator();
            const wicketGain = ctx.createGain();
            wicketOsc.connect(wicketGain).connect(gainNodeRef.current);

            wicketOsc.type = 'triangle';
            wicketOsc.frequency.setValueAtTime(350, now);
            wicketOsc.frequency.exponentialRampToValueAtTime(200, now + 0.3);
            wicketGain.gain.setValueAtTime(volume * 0.4, now);
            wicketGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

            wicketOsc.start(now);
            wicketOsc.stop(now + 0.4);

            // Add thunder effect for stormy weather
            if (weather === 'stormy') {
                playThunderEffect(ctx, now + 0.1);
            }
        } else if (runs === 6) {
            // Enhanced six sound with celebration
            const sixOsc = ctx.createOscillator();
            const sixGain = ctx.createGain();
            sixOsc.connect(sixGain).connect(gainNodeRef.current);

            sixOsc.type = 'sine';
            sixOsc.frequency.setValueAtTime(523, now);
            sixOsc.frequency.exponentialRampToValueAtTime(440, now + 0.8);
            sixGain.gain.setValueAtTime(volume * 0.5, now);
            sixGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

            sixOsc.start(now);
            sixOsc.stop(now + 1.2);

            // Trigger haptic feedback for mobile
            if (enhancedAudio.hapticEnabled && navigator.vibrate) {
                navigator.vibrate([100, 50, 100, 50, 200]);
            }
        } else if (runs === 4) {
            // Enhanced four sound
            const fourOsc = ctx.createOscillator();
            const fourGain = ctx.createGain();
            fourOsc.connect(fourGain).connect(gainNodeRef.current);

            fourOsc.type = 'triangle';
            fourOsc.frequency.setValueAtTime(440, now);
            fourOsc.frequency.linearRampToValueAtTime(330, now + 0.4);
            fourGain.gain.setValueAtTime(volume * 0.4, now);
            fourGain.gain.linearRampToValueAtTime(0.001, now + 0.5);

            fourOsc.start(now);
            fourOsc.stop(now + 0.5);
        }

        // Play weather ambient sounds
        playWeatherAmbient(weather);
    };
    const playWeatherAmbient = (weather) => {
        if (!enhancedAudio.weatherVolume || !audioContextRef.current) return;

        // Create subtle ambient weather sounds
        const ctx = audioContextRef.current;
        const now = ctx.currentTime;

        if (weather === 'rainy') {
            // Create rain sound effect
            const rainNoise = ctx.createBufferSource();
            const rainGain = ctx.createGain();
            const rainFilter = ctx.createBiquadFilter();

            rainFilter.type = 'highpass';
            rainFilter.frequency.value = 1000;
            rainGain.gain.setValueAtTime(enhancedAudio.weatherVolume * 0.3, now);

            rainNoise.connect(rainFilter).connect(rainGain).connect(gainNodeRef.current);
        } else if (weather === 'windy') {
            // Create wind sound effect
            const windOsc = ctx.createOscillator();
            const windGain = ctx.createGain();
            const windFilter = ctx.createBiquadFilter();

            windOsc.type = 'sawtooth';
            windOsc.frequency.setValueAtTime(80, now);
            windFilter.type = 'lowpass';
            windFilter.frequency.value = 200;
            windGain.gain.setValueAtTime(enhancedAudio.weatherVolume * 0.2, now);

            windOsc.connect(windFilter).connect(windGain).connect(gainNodeRef.current);
            windOsc.start(now);
            windOsc.stop(now + 2);
        }
    };

    const playThunderEffect = (ctx, startTime) => {
        const thunder = ctx.createOscillator();
        const thunderGain = ctx.createGain();
        thunder.connect(thunderGain).connect(gainNodeRef.current);

        thunder.type = 'sawtooth';
        thunder.frequency.setValueAtTime(60, startTime);
        thunder.frequency.exponentialRampToValueAtTime(30, startTime + 1.5);
        thunderGain.gain.setValueAtTime(enhancedAudio.weatherVolume * 0.3, startTime);
        thunderGain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.5);

        thunder.start(startTime);
        thunder.stop(startTime + 1.5);
    };

    // Enhanced scoring system
    const getScoreFromDigit = (digit) => {
        const diff = difficulties[gameState.difficulty];

        if (diff.outDigits.includes(digit)) {
            // Check for extra life power-up
            if (gameState.activePowerUp === 'extraLife') {
                setGameState(prev => ({ ...prev, activePowerUp: null }));
                return { runs: 0, isOut: false, powerUpUsed: true };
            }
            return { runs: 0, isOut: true };
        }

        if (diff.scoreDigits.includes(digit)) {
            let runs = digit;

            // Apply double runs power-up
            if (gameState.activePowerUp === 'doubleRuns') {
                runs *= 2;
            }

            return { runs: runs, isOut: false };
        }

        return { runs: 0, isOut: false };
    };

    // Power-up system
    const usePowerUp = (powerUpType) => {
        if (gameState.powerUps[powerUpType] <= 0 || gameState.isGameOver) return;

        setGameState(prev => ({
            ...prev,
            powerUps: {
                ...prev.powerUps,
                [powerUpType]: prev.powerUps[powerUpType] - 1
            },
            activePowerUp: powerUpType,
            doubleRunsRemaining: powerUpType === 'doubleRuns' ? 3 : prev.doubleRunsRemaining
        }));

        setUserStats(prev => ({ ...prev, powerUpsUsed: prev.powerUpsUsed + 1 }));

        // Show power-up activation message
        setCelebration(`🎁 ${enhancedPowerUps[powerUpType].name} ACTIVATED! 🎁`);
        setTimeout(() => setCelebration(''), 2000);
    };

    // Smart power-up suggestion system
    const suggestPowerUp = (gameState, weather) => {
        const suggestions = [];

        if (gameState.wickets >= 8) {
            suggestions.push({ powerUp: 'extraLife', reason: 'Low wickets remaining!' });
            suggestions.push({ powerUp: 'perfectPitch', reason: 'Secure your innings!' });
        }

        if (weather === 'rainy' || weather === 'stormy') {
            suggestions.push({ powerUp: 'weatherControl', reason: 'Poor weather conditions!' });
        }

        if (gameState.gameMode === 'timeAttack' && gameState.startTime) {
            const timeLeft = 120 - Math.floor((Date.now() - gameState.startTime) / 1000);
            if (timeLeft < 30) {
                suggestions.push({ powerUp: 'timeFreeze', reason: 'Time running out!' });
            }
        }

        if (gameState.activePowerUp === 'doubleRuns') {
            suggestions.push({ powerUp: 'sixStrike', reason: 'Combo with double runs!' });
        }

        return suggestions[0]; // Return best suggestion
    };

    // Weather change function - add after your existing functions
    const changeWeather = () => {
        const weatherOptions = Object.keys(weatherTypes);
        const newWeather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];

        setWeatherSystem(prev => ({
            ...prev,
            current: newWeather,
            lastChanged: Date.now(),
            intensity: 0.5 + Math.random() * 0.5
        }));

        // Add commentary for weather change
        addCommentary(`Weather update: ${weatherTypes[newWeather].description}!`);
    };

    // Commentary system - add after weather functions
    const commentaryTemplates = {
        six: [
            "MASSIVE SIX! That's gone into the stands!",
            "What a shot! Clean as a whistle!",
            "SIX! The crowd is on their feet!",
            "Incredible power! That ball has disappeared!"
        ],
        four: [
            "Beautiful four! Timing and placement!",
            "Cracking shot to the boundary!",
            "Four runs! Perfect execution!",
            "Brilliant stroke play!"
        ],
        wicket: [
            "GONE! What a delivery!",
            "Bowled! The stumps are shattered!",
            "OUT! The fielder takes a brilliant catch!",
            "Wicket! The pressure finally tells!"
        ],
        weather: {
            sunny: ["Perfect conditions for batting!", "The sun is shining bright!"],
            rainy: ["The rain is making things difficult!", "Slippery conditions out there!"],
            stormy: ["Lightning flashes across the sky!", "What dramatic conditions!"]
        }
    };

    const addCommentary = (text, type = 'general') => {
        const timestamp = Date.now();
        const mood = type === 'six' ? 'excited' : type === 'wicket' ? 'dramatic' : 'neutral';

        setCommentarySystem(prev => ({
            ...prev,
            currentComment: text,
            mood: mood,
            history: [...prev.history.slice(-9), { text, timestamp, type, mood }]
        }));

        // Clear comment after 3 seconds
        setTimeout(() => {
            setCommentarySystem(prev => ({ ...prev, currentComment: '' }));
        }, 3000);
    };

    // XP and leveling functions
    const gainXP = (amount, source) => {
        setProgressionSystem(prev => {
            const newXP = prev.xp + amount;
            const newLevel = Math.floor(newXP / 100) + 1; // Level up every 100 XP
            const skillPointsGained = newLevel - prev.level;

            if (skillPointsGained > 0) {
                addCommentary(`Level Up! You are now level ${newLevel}!`);
                setCelebration(`🎉 LEVEL ${newLevel}! +${skillPointsGained} Skill Points! 🎉`);
            }

            return {
                ...prev,
                xp: newXP,
                level: newLevel,
                skillPoints: prev.skillPoints + skillPointsGained
            };
        });
    };

    // Equipment bonus calculation
    const calculateEquipmentBonus = () => {
        const { bat, gloves, helmet } = progressionSystem.equipment;
        return bat.bonus + gloves.bonus + helmet.bonus;
    };

    const getContextualCommentary = (runs, isOut, gameState) => {
        const weather = weatherSystem.current;
        let commentary = '';

        if (isOut) {
            commentary = commentaryTemplates.wicket[Math.floor(Math.random() * commentaryTemplates.wicket.length)];
            if (weather === 'rainy') commentary += " The conditions finally got to the batsman!";
        } else if (runs === 6) {
            commentary = commentaryTemplates.six[Math.floor(Math.random() * commentaryTemplates.six.length)];
            if (weather === 'windy') commentary += " Despite the swirling wind!";
        } else if (runs === 4) {
            commentary = commentaryTemplates.four[Math.floor(Math.random() * commentaryTemplates.four.length)];
        }

        return commentary;
    };

    // Visual Effects System - add after commentary
    const triggerVisualEffect = (type, intensity = 1.0) => {
        if (!visualEffects.particles) return;

        switch (type) {
            case 'six':
                // Trigger fireworks effect
                setVisualEffects(prev => ({ ...prev, confetti: true }));
                setTimeout(() => setVisualEffects(prev => ({ ...prev, confetti: false })), 2000);
                break;
            case 'four':
                // Trigger sparkles
                setCelebration('✨ BOUNDARY! SPARKLING SHOT! ✨');
                break;
            case 'wicket':
                // Screen shake effect
                if (visualEffects.screenShake) {
                    document.body.style.animation = 'shake 0.5s';
                    setTimeout(() => document.body.style.animation = '', 500);
                }
                break;
            case 'weather':
                // Weather-specific effects handled in CSS
                break;
        }
    };

    const turnPage = () => {
        if (gameState.isGameOver || isAnimating) return;

        setIsAnimating(true);

        // Generate page and digit
        let newPage = Math.floor(Math.random() * gameState.totalPages) + 1;
        let lastDigit = newPage % 10;

        // Apply lucky page power-up
        if (gameState.activePowerUp === 'luckyPage') {
            const luckyDigits = [1, 2, 3, 4, 6];
            lastDigit = luckyDigits[Math.floor(Math.random() * luckyDigits.length)];
            newPage = Math.floor(newPage / 10) * 10 + lastDigit;
            setGameState(prev => ({ ...prev, activePowerUp: null }));
        }

        // Apply weather effects
        const weather = weatherSystem.current;
        const weatherMultiplier = weatherTypes[weather].scoreMultiplier;

        // Apply equipment bonuses
        const equipmentBonus = calculateEquipmentBonus();

        // Weather-based random events
        if (weather === 'stormy' && Math.random() < 0.1) {
            lastDigit = Math.random() < 0.5 ? 6 : 0;
            addCommentary("Lightning strikes! What drama!");
            triggerVisualEffect('weather');
        }

        // Get score with all modifiers
        const scoreResult = getScoreFromDigit(lastDigit);
        const baseRuns = scoreResult.runs;
        const finalRuns = Math.round(baseRuns * weatherMultiplier * (1 + equipmentBonus));

        // Generate contextual commentary
        const commentary = getContextualCommentary(finalRuns, scoreResult.isOut, gameState);
        if (commentary) addCommentary(commentary);

        // Enhanced audio and visual effects
        playEnhancedSound('hit', finalRuns, scoreResult.isOut);
        triggerVisualEffect(scoreResult.isOut ? 'wicket' : finalRuns >= 6 ? 'six' : finalRuns >= 4 ? 'four' : 'normal');

        // Gain XP based on performance
        if (finalRuns > 0) {
            gainXP(finalRuns * 2, 'scoring');
        }

        // Weather change chance (5% per ball)
        if (Math.random() < 0.05) {
            setTimeout(() => changeWeather(), 1000);
        }

        // Show power-up suggestions
        const suggestion = suggestPowerUp(gameState, weather);
        if (suggestion && gameState.powerUps[suggestion.powerUp] > 0) {
            setCelebration(`💡 Suggestion: Use ${suggestion.powerUp}! ${suggestion.reason}`);
        }

        // Calculate game state updates
        const newScore = gameState.score + finalRuns; // Use finalRuns here
        const newWickets = scoreResult.isOut ? gameState.wickets + 1 : gameState.wickets;
        const newBalls = gameState.ballsFaced + 1;
        const newStreak = finalRuns > 0 ? gameState.streak + 1 : 0;
        const newMaxStreak = Math.max(gameState.maxStreak, newStreak);

        // Handle double runs power-up
        let doubleRunsUsed = false;
        if (gameState.activePowerUp === 'doubleRuns' && finalRuns > 0) {
            doubleRunsUsed = true;
            const newDoubleRuns = Math.max(0, (gameState.doubleRunsRemaining || 3) - 1);
            setGameState(prev => ({
                ...prev,
                doubleRunsRemaining: newDoubleRuns,
                activePowerUp: newDoubleRuns > 0 ? 'doubleRuns' : null
            }));
        }

        playSound('hit', scoreResult.runs, scoreResult.isOut);

        // Check game end conditions
        let isGameOver = newWickets >= 10;

        // Time attack mode
        if (gameState.gameMode === 'timeAttack' && gameState.startTime) {
            const timeElapsed = (Date.now() - gameState.startTime) / 1000;
            if (timeElapsed >= 120) {
                isGameOver = true;
            }
        }

        // Over-based modes (T5, T10, T20)
        if (['t5', 't10', 't20'].includes(gameState.gameMode)) {
            const maxBalls = gameState.gameMode === 't5' ? 30 :
                gameState.gameMode === 't10' ? 60 : 120;
            if (newBalls >= maxBalls) {
                isGameOver = true;
            }
        }

        if (gameState.gameMode === 'chase' && newScore > gameState.targetScore) {
            isGameOver = true;
        }

        // Generate power-ups based on difficulty
        const newPowerUps = { ...gameState.powerUps };
        if (Math.random() < difficulties[gameState.difficulty].powerUpChance && !isGameOver) {
            const powerUpTypes = Object.keys(enhancedPowerUps);
            const randomPowerUp = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
            newPowerUps[randomPowerUp] += 1;
            setCelebration(`🎁 POWER-UP EARNED: ${enhancedPowerUps[randomPowerUp].name}! 🎁`);
            setTimeout(() => setCelebration(''), 2500);
        } else if (!gameState.activePowerUp || gameState.activePowerUp === 'luckyPage') {
            // Regular celebrations (only if no power-up celebration)
            if (scoreResult.runs === 6) {
                setCelebration('🚀 MASSIVE SIX! GONE FOR MILES! 🚀');
                setTimeout(() => setCelebration(''), 3500);
            } else if (scoreResult.runs === 4) {
                setCelebration('⚡ CRACKING FOUR! BOUNDARY! ⚡');
                setTimeout(() => setCelebration(''), 3000);
            } else if (scoreResult.isOut) {
                setCelebration(scoreResult.powerUpUsed ? '❤️ EXTRA LIFE SAVED YOU! ❤️' : '🏏 CLEAN BOWLED! WHAT A DELIVERY! 🏏');
                setTimeout(() => setCelebration(''), 3000);
            } else if (doubleRunsUsed) {
                setCelebration(`💫 DOUBLE RUNS! ${scoreResult.runs} → ${scoreResult.runs * 2}! 💫`);
                setTimeout(() => setCelebration(''), 2500);
            }
        }

        const newState = {
            ...gameState,
            currentPage: newPage,
            lastDigit: lastDigit,
            score: newScore,
            wickets: newWickets,
            ballsFaced: newBalls,
            isGameOver: newWickets >= 10,
            streak: newStreak,
            maxStreak: newMaxStreak,
            powerUps: newPowerUps,
            runs: [...gameState.runs, { runs: finalRuns, isOut: scoreResult.isOut, page: newPage, doubled: doubleRunsUsed }]
        };

        setGameState(newState);
        checkAchievements(newState);
        updateStats(newState);

        if (isGameOver) {
            handleGameEnd(newState);
        }

        setTimeout(() => setIsAnimating(false), 1000);
    };
    // Handle game end
    const handleGameEnd = (finalState) => {
        setGameHistory(prev => [...prev, {
            score: finalState.score,
            wickets: finalState.wickets,
            balls: finalState.ballsFaced,
            difficulty: finalState.difficulty,
            mode: finalState.gameMode,
            date: new Date().toLocaleDateString(),
            timestamp: Date.now()
        }]);

        // Update leaderboard
        if (finalState.score > 0) {
            setLeaderboard(prev => {
                const newEntry = {
                    name: finalState.playerName,
                    score: finalState.score,
                    difficulty: finalState.difficulty,
                    date: new Date().toLocaleDateString()
                };
                return [...prev, newEntry]
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 10);
            });
        }

        // Handle multiplayer
        if (gameState.gameMode === 'multiplayer') {
            handleMultiplayerEnd(finalState);
        }

        setTimeout(() => setCurrentScreen('gameOver'), 2000);
    };

    // Multiplayer functions
    const handleMultiplayerEnd = (finalState) => {
        const currentPlayerIndex = multiplayerData.currentPlayer - 1;
        const updatedPlayers = [...multiplayerData.players];
        updatedPlayers[currentPlayerIndex] = {
            ...updatedPlayers[currentPlayerIndex],
            score: finalState.score,
            wickets: finalState.wickets,
            balls: finalState.ballsFaced,
            isOut: true
        };

        if (multiplayerData.currentPlayer < multiplayerData.players.length) {
            // Next player's turn
            setMultiplayerData(prev => ({
                ...prev,
                currentPlayer: prev.currentPlayer + 1,
                players: updatedPlayers
            }));
            startNewGame(); // Start game for next player
        } else {
            // Game complete, determine winner
            const winner = updatedPlayers.reduce((prev, current) =>
                current.score > prev.score ? current : prev
            );

            setMultiplayerData(prev => ({
                ...prev,
                players: updatedPlayers,
                gameComplete: true,
                winner: winner
            }));

            if (winner.name === 'Player 1') {
                setUserStats(prev => ({ ...prev, multiplayerWins: prev.multiplayerWins + 1 }));
            }
        }
    };

    // Tournament functions
    const startTournament = () => {
        const bracket = [
            ['Player 1', 'Bot Easy'],
            ['Bot Medium', 'Bot Hard'],
            ['Winner 1', 'Winner 2'],
            ['Champion']
        ];

        setTournamentData({
            currentRound: 0,
            totalRounds: 3,
            bracket: bracket,
            isActive: true,
            winner: null
        });

        setCurrentScreen('tournament');
    };

    // Social sharing
    const shareScore = (score, mode, difficulty) => {
        const text = `🏏 Just scored ${score} runs in Book Cricket Pro! Playing ${mode} mode on ${difficulty} difficulty. Can you beat my score? 🚀`;

        if (navigator.share) {
            navigator.share({
                title: 'Book Cricket Pro Score',
                text: text,
                url: window.location.href
            });
        } else {
            // Fallback to copying to clipboard
            navigator.clipboard.writeText(text).then(() => {
                setCelebration('📱 Score copied to clipboard! Share it with friends! 📱');
                setTimeout(() => setCelebration(''), 3000);
            });
        }

        // Unlock social achievement
        if (!achievements.socialShare) {
            setAchievements(prev => ({ ...prev, socialShare: true }));
            setUserStats(prev => ({ ...prev, achievementsUnlocked: prev.achievementsUnlocked + 1 }));
        }
    };

    // Enhanced start new game
    const startNewGame = () => {
        const startTime = ['timeAttack'].includes(selectedMode) ? Date.now() : null;

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
            playerName: multiplayerData.isActive ? `Player ${multiplayerData.currentPlayer}` : 'Player 1',
            difficulty: selectedDifficulty,
            streak: 0,
            maxStreak: 0,
            powerUps: {
                luckyPage: gameState.powerUps?.luckyPage || 0,
                doubleRuns: gameState.powerUps?.doubleRuns || 0,
                extraLife: gameState.powerUps?.extraLife || 0
            },
            activePowerUp: null,
            doubleRunsRemaining: 0,
            timeLimit: selectedMode === 'timeAttack' ? 120 : null,
            startTime: startTime
        });

        setCelebration('');
        setCurrentScreen('game');
    };

    // Update stats and check achievements (keeping existing logic)
    const updateStats = (newState) => {
        setUserStats(prev => {
            const newStats = { ...prev };

            if (newState.isGameOver) {
                newStats.totalMatches += 1;
                newStats.totalRuns += newState.score;
                newStats.totalWickets += newState.wickets;
                newStats.totalBalls += newState.ballsFaced;
                newStats.highestScore = Math.max(newStats.highestScore, newState.score);
                newStats.longestStreak = Math.max(newStats.longestStreak, newState.maxStreak);
                newStats.averageScore = Math.round(newStats.totalRuns / newStats.totalMatches);
                newStats.strikeRate = Math.round((newStats.totalRuns / newStats.totalBalls) * 100);
                newStats.lastPlayedDate = new Date().toISOString();

                const sixes = newState.runs.filter(r => r.runs === 6).length;
                const fours = newState.runs.filter(r => r.runs === 4).length;
                newStats.totalSixes += sixes;
                newStats.totalFours += fours;

                // Check for fastest fifty
                if (newState.score >= 50 && newState.ballsFaced < (newStats.fastestFifty || 999)) {
                    newStats.fastestFifty = newState.ballsFaced;
                }

                if (newState.score >= 50 && newState.wickets === 0) {
                    newStats.perfectGames += 1;
                }
            }

            return newStats;
        });
    };

    const checkAchievements = (newState) => {
        const newAchievements = { ...achievements };
        let achievementUnlocked = false;

        // Existing achievement checks
        if (!achievements.firstSix && newState.runs.some(r => r.runs === 6)) {
            newAchievements.firstSix = true;
            achievementUnlocked = 'firstSix';
        }
        if (!achievements.centurion && newState.score >= 100) {
            newAchievements.centurion = true;
            achievementUnlocked = 'centurion';
        }
        if (!achievements.speedster && newState.gameMode === 'timeAttack' && newState.score >= 50) {
            newAchievements.speedster = true;
            achievementUnlocked = 'speedster';
        }

        if (achievementUnlocked) {
            setAchievements(newAchievements);
            setNewAchievement(achievementUnlocked);
            setTimeout(() => setNewAchievement(''), 4000);
        }
    };

    const resetGame = () => {
        setGameState(prev => ({
            currentPage: 1,
            totalPages: 500,
            score: 0,
            wickets: 0,
            ballsFaced: 0,
            isGameOver: false,
            lastDigit: null,
            runs: [],
            gameMode: prev.gameMode,
            targetScore: prev.targetScore,
            playerName: prev.playerName,
            difficulty: prev.difficulty,
            streak: 0,
            maxStreak: prev.maxStreak,
            powerUps: prev.powerUps,
            activePowerUp: null,
            timeLimit: prev.timeLimit,
            startTime: prev.gameMode === 'timeAttack' ? Date.now() : null
        }));
        setCelebration('');
        setCurrentScreen('game');
    };

    const goToHome = () => {
        setCurrentScreen('home');
        setMultiplayerData(prev => ({ ...prev, isActive: false }));
        setTournamentData(prev => ({ ...prev, isActive: false }));
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
    // Enhanced Stats Modal Component
    function StatsModal() {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40 p-4 backdrop-blur-sm">
                <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-6 max-w-md w-full mx-4 max-h-screen overflow-y-auto shadow-2xl border-4 border-white">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                            <BarChart3 className="w-6 h-6 text-blue-600" />
                            Career Statistics
                        </h2>
                        <button
                            onClick={() => setShowStats(false)}
                            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Overall Stats */}
                        <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-4 border-2 border-blue-300">
                            <h3 className="font-bold text-blue-800 mb-3 text-lg">📊 Overall Performance</h3>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="bg-white rounded-lg p-3 text-center">
                                    <div className="text-2xl font-bold text-blue-600">{userStats.totalRuns}</div>
                                    <div className="text-gray-600">Total Runs</div>
                                </div>
                                <div className="bg-white rounded-lg p-3 text-center">
                                    <div className="text-2xl font-bold text-green-600">{userStats.totalMatches}</div>
                                    <div className="text-gray-600">Matches Played</div>
                                </div>
                                <div className="bg-white rounded-lg p-3 text-center">
                                    <div className="text-2xl font-bold text-orange-600">{userStats.highestScore}</div>
                                    <div className="text-gray-600">Best Score</div>
                                </div>
                                <div className="bg-white rounded-lg p-3 text-center">
                                    <div className="text-2xl font-bold text-purple-600">{userStats.averageScore}</div>
                                    <div className="text-gray-600">Average</div>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Batting Stats */}
                        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-4 border-2 border-green-300">
                            <h3 className="font-bold text-green-800 mb-3 text-lg">🏏 Batting Analysis</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between bg-white rounded-lg p-2">
                                    <span>Strike Rate:</span>
                                    <span className="font-bold text-green-600">{userStats.strikeRate}%</span>
                                </div>
                                <div className="flex justify-between bg-white rounded-lg p-2">
                                    <span>Total Boundaries:</span>
                                    <span className="font-bold text-blue-600">{userStats.totalFours + userStats.totalSixes}</span>
                                </div>
                                <div className="flex justify-between bg-white rounded-lg p-2">
                                    <span>Fastest Fifty:</span>
                                    <span className="font-bold text-purple-600">{userStats.fastestFifty || 'N/A'} balls</span>
                                </div>
                                <div className="flex justify-between bg-white rounded-lg p-2">
                                    <span>Perfect Games:</span>
                                    <span className="font-bold text-yellow-600">{userStats.perfectGames}</span>
                                </div>
                                <div className="flex justify-between bg-white rounded-lg p-2">
                                    <span>Power-ups Used:</span>
                                    <span className="font-bold text-pink-600">{userStats.powerUpsUsed}</span>
                                </div>
                            </div>
                        </div>

                        {/* New Game Mode Stats */}
                        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 border-2 border-purple-300">
                            <h3 className="font-bold text-purple-800 mb-3 text-lg">🎮 Game Modes</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between bg-white rounded-lg p-2">
                                    <span>Multiplayer Wins:</span>
                                    <span className="font-bold text-purple-600">{userStats.multiplayerWins}</span>
                                </div>
                                <div className="flex justify-between bg-white rounded-lg p-2">
                                    <span>Tournament Wins:</span>
                                    <span className="font-bold text-yellow-600">{userStats.tournamentWins}</span>
                                </div>
                                <div className="flex justify-between bg-white rounded-lg p-2">
                                    <span>Challenges Completed:</span>
                                    <span className="font-bold text-orange-600">{userStats.challengesCompleted}</span>
                                </div>
                            </div>
                        </div>

                        {/* Achievement Progress */}
                        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 border-2 border-yellow-300">
                            <h3 className="font-bold text-orange-800 mb-3 text-lg">🏆 Achievements</h3>
                            <div className="flex justify-between items-center bg-white rounded-lg p-3">
                                <span>Unlocked:</span>
                                <span className="font-bold text-2xl text-yellow-600">{achievementCount}/16</span>
                            </div>
                            <div className="mt-2">
                                <div className="bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
                                        style={{ width: `${(achievementCount / 16) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="text-center text-sm text-gray-600 mt-1">
                                    {Math.round((achievementCount / 16) * 100)}% Complete
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Enhanced Achievements Modal Component
    function AchievementsModal() {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40 p-4 backdrop-blur-sm">
                <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl p-6 max-w-md w-full mx-4 max-h-screen overflow-y-auto shadow-2xl border-4 border-white">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <Trophy className="w-8 h-8 text-yellow-500 animate-bounce" />
                            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                                Achievements ({achievementCount}/16)
                            </span>
                        </h2>
                        <button
                            onClick={() => setShowAchievements(false)}
                            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                        <div className="bg-gray-200 rounded-full h-4">
                            <div
                                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-4 rounded-full transition-all duration-1000 relative"
                                style={{ width: `${(achievementCount / 16) * 100}%` }}
                            >
                                <div className="absolute right-0 top-0 h-4 w-4 bg-white rounded-full shadow-md transform translate-x-2"></div>
                            </div>
                        </div>
                        <div className="text-center text-sm text-gray-600 mt-2">
                            {Math.round((achievementCount / 16) * 100)}% Complete • Total Points: {Object.keys(achievements).filter(key => achievements[key]).reduce((sum, key) => sum + achievementDefs[key].points, 0)}
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {Object.entries(achievementDefs).map(([key, achievement]) => (
                            <div
                                key={key}
                                className={`p-4 rounded-3xl border-3 transition-all transform hover:scale-105 relative overflow-hidden ${
                                    achievements[key]
                                        ? 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50 shadow-lg'
                                        : 'border-gray-200 bg-gray-50 opacity-60'
                                }`}
                            >
                                {achievements[key] && (
                                    <div className="absolute top-2 right-2">
                                        <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                            +{achievement.points}
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center gap-4">
                                    <div className={`text-3xl ${achievements[key] ? 'animate-pulse' : 'grayscale'}`}>
                                        {achievement.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-gray-800 text-lg">{achievement.name}</div>
                                        <div className="text-sm text-gray-600">{achievement.desc}</div>
                                        {achievements[key] && (
                                            <div className="text-xs text-green-600 font-semibold mt-1">✅ UNLOCKED!</div>
                                        )}
                                    </div>
                                    {achievements[key] && (
                                        <Medal className="w-6 h-6 text-yellow-500 animate-spin" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Achievement Tips */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl border-2 border-blue-300">
                        <h4 className="font-bold text-blue-800 mb-2">💡 Pro Tips to Unlock More:</h4>
                        <div className="text-sm text-blue-700 space-y-1">
                            <p>• Try different difficulty levels for unique achievements</p>
                            <p>• Use power-ups strategically for better scores</p>
                            <p>• Play multiplayer and tournament modes</p>
                            <p>• Share your scores to unlock social achievements</p>
                            <p>• Complete daily challenges for bonus rewards</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // New Leaderboard Modal Component
    function LeaderboardModal() {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40 p-4 backdrop-blur-sm">
                <div className="bg-gradient-to-br from-white to-yellow-50 rounded-3xl p-6 max-w-md w-full mx-4 max-h-screen overflow-y-auto shadow-2xl border-4 border-white">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <Crown className="w-8 h-8 text-yellow-500 animate-bounce" />
                            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                                Leaderboard
                            </span>
                        </h2>
                        <button
                            onClick={() => setShowLeaderboard(false)}
                            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="space-y-3">
                        {leaderboard.map((entry, index) => (
                            <div
                                key={index}
                                className={`p-4 rounded-2xl border-2 transition-all transform hover:scale-105 ${
                                    index === 0 ? 'border-yellow-400 bg-gradient-to-r from-yellow-100 to-orange-100' :
                                        index === 1 ? 'border-gray-400 bg-gradient-to-r from-gray-100 to-blue-100' :
                                            index === 2 ? 'border-orange-400 bg-gradient-to-r from-orange-100 to-red-100' :
                                                'border-gray-200 bg-white'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`text-2xl font-bold ${
                                            index === 0 ? 'text-yellow-600' :
                                                index === 1 ? 'text-gray-600' :
                                                    index === 2 ? 'text-orange-600' :
                                                        'text-gray-500'
                                        }`}>
                                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-800">{entry.name}</div>
                                            <div className="text-sm text-gray-600">{entry.date}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-blue-600">{entry.score}</div>
                                        <div className="text-xs text-gray-500">{difficulties[entry.difficulty]?.name}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl border-2 border-green-300">
                        <h4 className="font-bold text-green-800 mb-2">🎯 Your Best Performance:</h4>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">{userStats.highestScore}</div>
                            <div className="text-sm text-gray-600">Personal Best</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // New Settings Modal Component
    function SettingsModal() {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40 p-4 backdrop-blur-sm">
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 max-w-md w-full mx-4 max-h-screen overflow-y-auto shadow-2xl border-4 border-white">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <Settings className="w-8 h-8 text-gray-600" />
                            <span className="bg-gradient-to-r from-gray-600 to-blue-600 bg-clip-text text-transparent">
                                Settings
                            </span>
                        </h2>
                        <button
                            onClick={() => setShowSettings(false)}
                            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Audio Settings */}
                        <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-4 border-2 border-blue-300">
                            <h3 className="font-bold text-blue-800 mb-4 text-lg">🔊 Audio Settings</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-700">Sound Effects</span>
                                    <button
                                        onClick={audioEnabled ? () => setAudioEnabled(false) : enableAudio}
                                        className={`p-3 rounded-full transition-all transform hover:scale-110 ${
                                            audioEnabled ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                                        }`}
                                    >
                                        {audioEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-700">Background Music</span>
                                    <button
                                        onClick={() => {
                                            if (!audioEnabled) enableAudio();
                                            if (persistentMusicEnabled) {
                                                setPersistentMusicEnabled(false);
                                            } else {
                                                setPersistentMusicEnabled(true);
                                            }
                                        }}
                                        className={`p-3 rounded-full transition-all transform hover:scale-110 ${
                                            persistentMusicEnabled ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                                        }`}
                                    >
                                        <Music className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Game Settings */}
                        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-4 border-2 border-green-300">
                            <h3 className="font-bold text-green-800 mb-4 text-lg">🎮 Game Preferences</h3>
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
                                <div>
                                    <label className="block text-gray-700 mb-2">Preferred Game Mode</label>
                                    <select
                                        value={selectedMode}
                                        onChange={(e) => setSelectedMode(e.target.value)}
                                        className="w-full p-3 rounded-lg border-2 border-green-300 focus:border-green-500 focus:outline-none"
                                    >
                                        {Object.entries(gameModes).map(([key, mode]) => (
                                            <option key={key} value={key}>{mode.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Data Management */}
                        <div className="bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl p-4 border-2 border-red-300">
                            <h3 className="font-bold text-red-800 mb-4 text-lg">📊 Data Management</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to reset all statistics? This cannot be undone.')) {
                                            setUserStats({
                                                totalRuns: 0, totalMatches: 0, totalWickets: 0, totalBalls: 0,
                                                totalSixes: 0, totalFours: 0, highestScore: 0, longestStreak: 0,
                                                averageScore: 0, strikeRate: 0, matchesWon: 0, achievementsUnlocked: 0,
                                                timePlayedMinutes: 0, favoriteDigit: null, lastPlayedDate: null,
                                                weeklyGoal: 500, weeklyProgress: 0,
                                                fastestFifty: null, tournamentWins: 0, multiplayerWins: 0,
                                                challengesCompleted: 0, powerUpsUsed: 0, perfectGames: 0
                                            });
                                            setAchievements({
                                                firstSix: false, centurion: false, ballOfFire: false, survivor: false,
                                                chasemaster: false, streakking: false, quickfire: false, boundary: false,
                                                legend: false, nightmare: false, perfectGame: false, doublecentury: false,
                                                speedster: false, multiWin: false, tournamentChamp: false, socialShare: false
                                            });
                                            setGameHistory([]);
                                        }
                                    }}
                                    className="w-full py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-all"
                                >
                                    Reset All Data
                                </button>
                                <button
                                    onClick={() => {
                                        const data = {
                                            userStats,
                                            achievements,
                                            gameHistory,
                                            leaderboard
                                        };
                                        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = 'book-cricket-data.json';
                                        a.click();
                                        URL.revokeObjectURL(url);
                                    }}
                                    className="w-full py-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-all"
                                >
                                    Export Game Data
                                </button>
                            </div>
                        </div>

                        {/* About */}
                        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 border-2 border-yellow-300">
                            <h3 className="font-bold text-orange-800 mb-2 text-lg">📚 About Book Cricket Pro</h3>
                            <div className="text-sm text-orange-700 space-y-2">
                                <p>Relive the classic school game with modern features!</p>
                                <p><strong>Version:</strong> 2.0 Enhanced</p>
                                <p><strong>Features:</strong> Power-ups, Multiplayer, Tournaments, Daily Challenges</p>
                                <p><strong>New in v2.0:</strong> Time Attack, Survival Mode, Enhanced Audio, Social Sharing</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    if (currentScreen === 'home') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 relative overflow-hidden">
                {/* Enhanced background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                    <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                </div>
                <style>{enhancedStyles}</style>
                {/* Your existing JSX */}
                <div className={`min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 relative overflow-hidden 
    ${weatherSystem.current === 'rainy' ? 'weather-rain' : ''}
    ${weatherSystem.current === 'stormy' && Math.random() < 0.1 ? 'weather-lightning' : ''}
`}>

                    <div className="max-w-md mx-auto relative z-10">
                        <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl overflow-hidden border-4 border-white backdrop-blur-lg">
                            {/* Enhanced Header */}
                            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white relative overflow-hidden text-center">
                                <div className="absolute inset-0 bg-black opacity-10"></div>
                                <div className="relative">
                                    <BookOpen className="w-16 h-16 mx-auto mb-4 animate-bounce" />
                                    <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent mb-2">
                                        Book Cricket Pro
                                    </h1>
                                    <p className="text-blue-100 text-lg font-medium">🏫 Relive your school days! 📚</p>
                                    <div className="mt-4 flex justify-center gap-2 flex-wrap">
                                    <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full text-sm font-bold shadow-lg">
                                        🏆 {achievementCount}/16 Achievements
                                    </span>
                                        <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-sm font-bold shadow-lg">
                                        📊 {userStats.totalMatches} Games
                                    </span>
                                        <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-sm font-bold shadow-lg">
                                        🔥 {userStats.highestScore} Best
                                    </span>
                                    </div>
                                </div>
                            </div>

                            {/* Daily Challenge */}
                            <div className="p-6 bg-gradient-to-r from-yellow-400 to-orange-400 text-black">
                                <div className="text-center">
                                    <h3 className="font-bold text-lg mb-2">🎯 Daily Challenge</h3>
                                    <p className="text-sm mb-2">{dailyChallenge.description}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs">Progress: {dailyChallenge.progress}/{dailyChallenge.target}</span>
                                        <span className="text-xs">⏰ {dailyChallenge.expiresIn}</span>
                                    </div>
                                    <div className="bg-white rounded-full h-2 mt-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${(dailyChallenge.progress / dailyChallenge.target) * 100}%` }}
                                        ></div>
                                    </div>
                                    {dailyChallenge.completed && (
                                        <div className="text-green-700 font-bold mt-2">✅ Completed! Reward: {dailyChallenge.reward}</div>
                                    )}
                                </div>
                            </div>

                            {/* Game Setup */}
                            <div className="p-8 space-y-8">
                                {/* Difficulty Selection */}
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">🎮 Choose Difficulty</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {Object.entries(difficulties).map(([key, diff]) => (
                                            <button
                                                key={key}
                                                onClick={() => setSelectedDifficulty(key)}
                                                className={`p-4 rounded-2xl border-3 text-center transition-all transform hover:scale-105 ${
                                                    selectedDifficulty === key
                                                        ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-xl scale-105'
                                                        : 'border-gray-200 hover:border-gray-300 bg-white shadow-md'
                                                }`}
                                            >
                                                <div className="text-3xl mb-2">{diff.icon}</div>
                                                <div className="font-bold text-lg">{diff.name}</div>
                                                <div className="text-sm text-gray-600">{diff.description}</div>
                                                <div className="text-xs text-purple-600 font-semibold mt-1">×{diff.multiplier} points</div>
                                                <div className="text-xs text-green-600 font-semibold">🎁 {Math.round(diff.powerUpChance * 100)}% power-ups</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Enhanced Game Mode Selection */}
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">🏏 Game Mode</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {Object.entries(gameModes).map(([key, mode]) => (
                                            <button
                                                key={key}
                                                onClick={() => setSelectedMode(key)}
                                                className={`p-3 rounded-2xl border-3 text-center transition-all transform hover:scale-105 ${
                                                    selectedMode === key
                                                        ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-xl'
                                                        : 'border-gray-200 hover:border-gray-300 bg-white shadow-md'
                                                }`}
                                            >
                                                <div className="text-2xl mb-2">{mode.icon}</div>
                                                <div className="font-bold text-sm">{mode.name}</div>
                                                <div className="text-xs text-gray-600">{mode.description}</div>
                                                {selectedMode === key && <Star className="w-4 h-4 text-yellow-500 animate-spin mx-auto mt-1" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Chase Target Input */}
                                {selectedMode === 'chase' && (
                                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold rounded-lg p-4 shadow-lg border-2 border-yellow-600">
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
                                        <p className="text-sm text-orange-700 text-center mt-2">
                                            Recommended: 50-150 for beginners, 200+ for experts
                                        </p>
                                    </div>
                                )}

                                {/* Power-ups Display */}
                                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 border-2 border-purple-300">
                                    <h4 className="font-bold text-purple-800 mb-3 text-center">🎁 Your Power-ups</h4>
                                    <div className="grid grid-cols-3 gap-3 text-center">
                                        {Object.entries(enhancedPowerUps).map(([key, powerUp]) => (
                                            <div key={key} className="bg-white rounded-lg p-2">
                                                <div className="text-xl">{powerUp.icon}</div>
                                                <div className="text-xs font-bold">{powerUp.name}</div>
                                                <div className="text-lg font-bold text-purple-600">{gameState.powerUps?.[key] || 0}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-purple-600 text-center mt-2">
                                        Earn power-ups during gameplay based on difficulty level!
                                    </p>
                                </div>

                                {/* Start Game Button */}
                                <button
                                    onClick={() => {
                                        if (selectedMode === 'multiplayer') {
                                            setMultiplayerData(prev => ({ ...prev, isActive: true, currentPlayer: 1 }));
                                        } else if (selectedMode === 'tournament') {
                                            startTournament();
                                            return;
                                        }
                                        startNewGame();
                                    }}
                                    disabled={selectedMode === 'chase' && !targetScore}
                                    className={`w-full py-6 rounded-3xl font-bold text-2xl transition-all duration-300 transform shadow-2xl relative overflow-hidden ${
                                        selectedMode === 'chase' && !targetScore
                                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white hover:from-green-600 hover:via-blue-600 hover:to-purple-600 hover:scale-105 active:scale-95'
                                    }`}
                                >
                                    <div className="relative z-10 flex items-center justify-center gap-3">
                                        <Play className="w-8 h-8" />
                                        {selectedMode === 'tournament' ? 'Start Tournament' : 'Start New Game'}
                                    </div>
                                </button>

                                {/* Quick Access Buttons */}
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setShowStats(true)}
                                        className="py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <BarChart3 className="w-5 h-5" />
                                        Statistics
                                    </button>
                                    <button
                                        onClick={() => setShowAchievements(true)}
                                        className="py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl font-bold hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <Trophy className="w-5 h-5" />
                                        Achievements
                                    </button>
                                    <button
                                        onClick={() => setShowLeaderboard(true)}
                                        className="py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl font-bold hover:from-red-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <Crown className="w-5 h-5" />
                                        Leaderboard
                                    </button>
                                    <button
                                        onClick={() => setShowSettings(true)}
                                        className="py-4 bg-gradient-to-r from-gray-500 to-blue-500 text-white rounded-2xl font-bold hover:from-gray-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <Settings className="w-5 h-5" />
                                        Settings
                                    </button>
                                </div>

                                {/* Rules Button */}
                                <button
                                    onClick={() => setShowRules(!showRules)}
                                    className="w-full py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-2xl font-bold hover:from-gray-700 hover:to-gray-800 transition-all transform hover:scale-105 shadow-lg"
                                >
                                    {showRules ? 'Hide Rules' : 'Show Rules & Power-ups'}
                                </button>

                                {/* Enhanced Rules Section */}
                                {showRules && (
                                    <div className="bg-gradient-to-r from-yellow-100 via-orange-100 to-red-100 rounded-3xl border-4 border-yellow-300 shadow-lg p-6">
                                        <h3 className="font-bold text-orange-800 mb-4 text-xl text-center">📋 How to Play</h3>
                                        <div className="text-sm text-orange-700 space-y-3">
                                            <div className="bg-white rounded-lg p-3 shadow-md">
                                                <p className="font-semibold mb-2">🎯 Basic Rules:</p>
                                                <p>• Tap "Turn Page" to get a random page number (1-500)</p>
                                                <p>• Only digits 1, 2, 3, 4, 6 score runs</p>
                                                <p>• Other digits are either OUT or dot balls</p>
                                                <p>• Game ends when you lose 10 wickets</p>
                                            </div>

                                            <div className="bg-white rounded-lg p-3 shadow-md">
                                                <p className="font-semibold mb-2">🎁 Power-ups:</p>
                                                <div className="text-xs space-y-1">
                                                    <p><strong>🍀 Lucky Page:</strong> Next page guaranteed to score</p>
                                                    <p><strong>💫 Double Runs:</strong> 2x runs for next 3 balls</p>
                                                    <p><strong>❤️ Extra Life:</strong> Survive one wicket</p>
                                                </div>
                                            </div>

                                            <div className="bg-white rounded-lg p-3 shadow-md">
                                                <p className="font-semibold mb-2">🏏 Game Modes:</p>
                                                <div className="text-xs space-y-1">
                                                    <p><strong>⏱️ Time Attack:</strong> Score maximum in 2 minutes</p>
                                                    <p><strong>🛡️ Survival:</strong> How long can you survive?</p>
                                                    <p><strong>👥 Multiplayer:</strong> Take turns with friends</p>
                                                    <p><strong>🏆 Tournament:</strong> Compete in brackets</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Modals for home screen */}
                    {showStats && <StatsModal />}
                    {showAchievements && <AchievementsModal />}
                    {showLeaderboard && <LeaderboardModal />}
                    {showSettings && <SettingsModal />}
                </div>
            </div>
        );
    }
    // TOURNAMENT SCREEN
    if (currentScreen === 'tournament') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 relative overflow-hidden">
                <div className="max-w-md mx-auto relative z-10">
                    <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl overflow-hidden border-4 border-white">
                        {/* Tournament Header */}
                        <div className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 p-6 text-white text-center">
                            <Crown className="w-12 h-12 mx-auto mb-3 animate-bounce" />
                            <h1 className="text-3xl font-bold mb-2">🏆 Tournament Mode 🏆</h1>
                            <p className="text-sm">Round {tournamentData.currentRound + 1} of {tournamentData.totalRounds}</p>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Tournament Bracket */}
                            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-4 border-2 border-blue-300">
                                <h3 className="font-bold text-blue-800 mb-3 text-center">Tournament Bracket</h3>
                                <div className="space-y-2">
                                    {tournamentData.bracket.map((round, roundIndex) => (
                                        <div key={roundIndex} className="space-y-2">
                                            <h4 className="font-bold text-sm text-center">{
                                                roundIndex === 0 ? 'Quarter Finals' :
                                                    roundIndex === 1 ? 'Semi Finals' :
                                                        roundIndex === 2 ? 'Final' : 'Champion'
                                            }</h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                {round.map((player, playerIndex) => (
                                                    <div key={playerIndex} className={`p-2 rounded-lg text-center text-sm ${
                                                        roundIndex <= tournamentData.currentRound ?
                                                            'bg-green-200 text-green-800' :
                                                            'bg-gray-200 text-gray-600'
                                                    }`}>
                                                        {player}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Current Match */}
                            <div className="bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl p-4 border-2 border-red-300">
                                <h3 className="font-bold text-red-800 mb-3 text-center">Current Match</h3>
                                <div className="text-center">
                                    <p className="text-lg font-bold">
                                        {tournamentData.bracket[tournamentData.currentRound]?.[0]} vs {tournamentData.bracket[tournamentData.currentRound]?.[1]}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-2">You are playing as {tournamentData.bracket[tournamentData.currentRound]?.[0]}</p>
                                </div>
                            </div>

                            {/* Tournament Actions */}
                            <div className="space-y-4">
                                <button
                                    onClick={() => {
                                        setGameState(prev => ({
                                            ...prev,
                                            gameMode: 'tournament',
                                            playerName: tournamentData.bracket[tournamentData.currentRound]?.[0]
                                        }));
                                        startNewGame();
                                    }}
                                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
                                >
                                    <Swords className="w-6 h-6" />
                                    Start Match
                                </button>

                                <button
                                    onClick={goToHome}
                                    className="w-full py-4 bg-gradient-to-r from-gray-500 to-blue-500 text-white rounded-2xl font-bold text-lg hover:from-gray-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
                                >
                                    <ArrowLeft className="w-6 h-6" />
                                    Back to Menu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

        // GAME OVER SCREEN
        if (currentScreen === 'gameOver') {
            const isMultiplayer = gameState.gameMode === 'multiplayer';
            const isTournament = gameState.gameMode === 'tournament';

            return (
                <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 relative overflow-hidden">
                    {/* Background elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                    </div>

                    <div className="max-w-md mx-auto relative z-10">
                        <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl overflow-hidden border-4 border-white backdrop-blur-lg">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 p-6 text-white text-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-black opacity-10"></div>
                                <div className="relative">
                                    <Crown className="w-12 h-12 mx-auto mb-3 text-yellow-300 animate-bounce" />
                                    <h1 className="text-3xl font-bold mb-2">
                                        {isMultiplayer ? '👥 Match Complete! 👥' :
                                            isTournament ? '🏆 Tournament Match! 🏆' :
                                                '🏏 Match Complete! 🏏'}
                                    </h1>
                                </div>
                            </div>

                            {/* Game Results */}
                            <div className="p-8 space-y-6">
                                {/* Final Score */}
                                <div className="text-center bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl p-6 border-2 border-blue-300">
                                    <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                                        {gameState.score}/{gameState.wickets}
                                    </div>
                                    <div className="text-lg text-gray-700 mb-3">
                                        {gameState.gameMode === 'chase' && gameState.score > gameState.targetScore
                                            ? `🎉 VICTORIOUS! Target chased with ${10 - gameState.wickets} wickets to spare! 🎉`
                                            : gameState.gameMode === 'chase' && gameState.wickets >= 10
                                                ? `💔 Valiant effort! Fell short by ${gameState.targetScore - gameState.score} runs! 💔`
                                                : gameState.gameMode === 'timeAttack'
                                                    ? `⏱️ Time Attack Complete! 2 minutes up!`
                                                    : `🏏 Final Score in ${gameState.ballsFaced} balls`
                                        }
                                    </div>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <div>Strike Rate: {gameState.ballsFaced > 0 ? Math.round((gameState.score / gameState.ballsFaced) * 100) : 0}%</div>
                                        <div>Best Streak: {gameState.maxStreak} balls</div>
                                        <div>Boundaries: {gameState.runs.filter(r => r.runs >= 4 && !r.isOut).length}</div>
                                        <div>Difficulty: {difficulties[gameState.difficulty].name} (×{difficulties[gameState.difficulty].multiplier})</div>
                                    </div>
                                </div>

                                {/* Multiplayer Results */}
                                {isMultiplayer && multiplayerData.gameComplete && (
                                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-4 border-2 border-green-300">
                                        <h3 className="font-bold text-green-800 mb-3 text-center">👥 Multiplayer Results</h3>
                                        <div className="space-y-2">
                                            {multiplayerData.players.map((player, index) => (
                                                <div key={index} className={`flex justify-between items-center p-2 rounded-lg ${
                                                    player.name === multiplayerData.winner?.name ? 'bg-yellow-200' : 'bg-white'
                                                }`}>
                                                <span className="font-bold">
                                                    {player.name === multiplayerData.winner?.name ? '👑 ' : ''}{player.name}
                                                </span>
                                                    <span>{player.score}/{player.wickets}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="text-center mt-3 text-lg font-bold text-green-700">
                                            🏆 Winner: {multiplayerData.winner?.name}!
                                        </div>
                                    </div>
                                )}

                                {/* New Achievement Notification */}
                                {newAchievement && (
                                    <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 border-2 border-yellow-300 animate-pulse">
                                        <div className="text-center">
                                            <div className="text-3xl mb-2">{achievementDefs[newAchievement].icon}</div>
                                            <div className="font-bold text-orange-800 text-lg">🎉 NEW ACHIEVEMENT! 🎉</div>
                                            <div className="font-bold text-gray-700">{achievementDefs[newAchievement].name}</div>
                                            <div className="text-sm text-gray-600">{achievementDefs[newAchievement].desc}</div>
                                            <div className="text-sm text-green-600 font-bold">+{achievementDefs[newAchievement].points} points!</div>
                                        </div>
                                    </div>
                                )}

                                {/* Performance Stats */}
                                <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-4 border-2 border-green-300">
                                    <h3 className="font-bold text-green-800 mb-3 text-center">📊 Performance Analysis</h3>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="bg-white rounded-lg p-3 text-center">
                                            <div className="text-2xl font-bold text-blue-600">{gameState.runs.filter(r => r.runs === 6).length}</div>
                                            <div className="text-gray-600">Sixes</div>
                                        </div>
                                        <div className="bg-white rounded-lg p-3 text-center">
                                            <div className="text-2xl font-bold text-green-600">{gameState.runs.filter(r => r.runs === 4).length}</div>
                                            <div className="text-gray-600">Fours</div>
                                        </div>
                                        <div className="bg-white rounded-lg p-3 text-center">
                                            <div className="text-2xl font-bold text-orange-600">{gameState.runs.filter(r => r.runs === 0 && !r.isOut).length}</div>
                                            <div className="text-gray-600">Dots</div>
                                        </div>
                                        <div className="bg-white rounded-lg p-3 text-center">
                                            <div className="text-2xl font-bold text-purple-600">{userStats.powerUpsUsed}</div>
                                            <div className="text-gray-600">Power-ups Used</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Share Score */}
                                <div className="text-center">
                                    <button
                                        onClick={() => shareScore(gameState.score, gameState.gameMode, gameState.difficulty)}
                                        className="mb-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-bold hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 mx-auto"
                                    >
                                        <Share2 className="w-5 h-5" />
                                        Share Your Score
                                    </button>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-4">
                                    {!isMultiplayer && !isTournament && (
                                        <button
                                            onClick={resetGame}
                                            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
                                        >
                                            <RotateCcw className="w-6 h-6" />
                                            Play Again
                                        </button>
                                    )}

                                    {isMultiplayer && !multiplayerData.gameComplete && (
                                        <button
                                            onClick={() => {
                                                setCurrentScreen('game');
                                                startNewGame();
                                            }}
                                            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
                                        >
                                            <Users className="w-6 h-6" />
                                            Next Player: {multiplayerData.players[multiplayerData.currentPlayer - 1]?.name}
                                        </button>
                                    )}

                                    <button
                                        onClick={goToHome}
                                        className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
                                    >
                                        <Home className="w-6 h-6" />
                                        Back to Menu
                                    </button>
                                </div>

                                {/* Recent Performance */}
                                {gameState.runs.length > 0 && (
                                    <div className="bg-gradient-to-r from-gray-100 to-blue-100 rounded-2xl p-4 border-2 border-blue-200">
                                        <h3 className="font-bold text-gray-700 mb-3 text-center">🏏 Ball by Ball</h3>
                                        <div className="flex flex-wrap gap-2 justify-center">
                                            {gameState.runs.slice(-15).map((run, index) => (
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

        // GAME SCREEN
        return (
            <>
                <style>{enhancedStyles}</style>
                {/* Confetti Effect */}
                <ConfettiEffect active={visualEffects.confetti} />

                <div className={`min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 relative overflow-hidden 
            ${weatherSystem.current === 'rainy' ? 'weather-rain' : ''}
            ${weatherSystem.current === 'stormy' && Math.random() < 0.1 ? 'weather-lightning' : ''}
        `}>
                    {/* Enhanced background elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>

                        {/* Cricket field lines effect */}
                        <div className="absolute inset-0 opacity-5">
                            <div className="absolute top-1/2 left-0 w-full h-px bg-white"></div>
                            <div className="absolute top-0 left-1/2 w-px h-full bg-white"></div>
                            <div className="absolute top-1/2 left-1/2 w-32 h-32 border border-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                        </div>
                    </div>

                    {/* Main Container */}
                    <div className="max-w-md mx-auto relative z-10">
                        <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl overflow-hidden border-4 border-white backdrop-blur-lg">
                            {/* Enhanced Header */}
                            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 text-white relative overflow-hidden">
                                <div className="absolute inset-0 bg-black opacity-10"></div>
                                <div className="relative">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <BookOpen className="w-8 h-8 animate-pulse" />
                                                <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                                                    Book Cricket Pro
                                                </h1>
                                            </div>

                                            <p className="text-blue-100 text-sm font-medium">
                                                {gameState.gameMode === 'timeAttack' ? '⏱️ Time Attack Mode!' :
                                                    gameState.gameMode === 't5' ? '⚡ T5 Cricket - 5 Overs!' :
                                                        gameState.gameMode === 't10' ? '🔥 T10 Cricket - 10 Overs!' :
                                                            gameState.gameMode === 't20' ? '🏆 T20 Cricket - 20 Overs!' :
                                                                gameState.gameMode === 'multiplayer' ? `👥 ${gameState.playerName}'s Turn` :
                                                                    gameState.gameMode === 'tournament' ? '🏆 Tournament Match!' :
                                                                        '🏫 Live Match in Progress! 📚'}
                                            </p>
                                            <div className="flex items-center gap-2 mt-3 flex-wrap">
                                        <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full text-sm font-bold shadow-lg">
                                            {difficulties[gameState.difficulty].name}
                                        </span>
                                                <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-sm font-bold shadow-lg">
                                            🏆 {achievementCount}/16
                                        </span>
                                                {gameState.gameMode === 'timeAttack' && gameState.startTime && (
                                                    <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-lg font-bold shadow-lg animate-pulse">
                                                ⏰ {Math.max(0, 120 - Math.floor((Date.now() - gameState.startTime) / 1000))}s
                                            </span>
                                                )}
                                                {['t5', 't10', 't20'].includes(gameState.gameMode) && (
                                                    <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-teal-500 rounded-full text-sm font-bold shadow-lg">
                                                {gameState.gameMode === 't5' ? `⚡ ${Math.floor(gameState.ballsFaced / 6)}.${gameState.ballsFaced % 6}/5.0` :
                                                    gameState.gameMode === 't10' ? `🔥 ${Math.floor(gameState.ballsFaced / 6)}.${gameState.ballsFaced % 6}/10.0` :
                                                        `🏆 ${Math.floor(gameState.ballsFaced / 6)}.${gameState.ballsFaced % 6}/20.0`} Overs
                                            </span>
                                                )}
                                            </div>

                                            {/* Weather Display - MOVED INSIDE HEADER */}
                                            <div className="mt-3 bg-white bg-opacity-20 rounded-lg p-2 backdrop-blur-sm">
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-2xl">{weatherTypes[weatherSystem.current].icon}</span>
                                                        <span className="font-bold">{weatherTypes[weatherSystem.current].name}</span>
                                                    </div>
                                                    <div className="text-xs">
                                                        Score: ×{weatherTypes[weatherSystem.current].scoreMultiplier}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* XP Display - MOVED INSIDE HEADER */}
                                            <div className="mt-2 bg-white bg-opacity-20 rounded-lg p-2 backdrop-blur-sm">
                                                <div className="flex justify-between items-center text-xs">
                                                    <span>Level {progressionSystem.level}</span>
                                                    <span>XP: {progressionSystem.xp}</span>
                                                    <span>SP: {progressionSystem.skillPoints}</span>
                                                </div>
                                                <div className="mt-1 bg-white bg-opacity-30 rounded-full h-1">
                                                    <div
                                                        className="bg-yellow-400 h-1 rounded-full transition-all duration-500"
                                                        style={{ width: `${((progressionSystem.xp % 100) / 100) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={goToHome}
                                                className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all transform hover:scale-110 backdrop-blur-sm"
                                            >
                                                <ArrowLeft className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setShowStats(true)}
                                                className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all transform hover:scale-110 backdrop-blur-sm"
                                            >
                                                <BarChart3 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced Score Display */}
                            <div className="p-6 bg-gradient-to-b from-white to-blue-50">
                                <div className="text-center mb-6">
                                    <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                                        {gameState.score}/{gameState.wickets}
                                    </div>
                                    <div className="text-sm text-gray-600 space-y-2">
                                        <div className="flex justify-center gap-2 flex-wrap">
                                    <span className="bg-blue-100 px-2 py-1 rounded-full font-semibold text-xs">
                                        🎾 {Math.floor(gameState.ballsFaced / 6)}.{gameState.ballsFaced % 6}
                                    </span>
                                            <span className="bg-orange-100 px-2 py-1 rounded-full font-semibold text-xs">🔥 {gameState.streak}</span>
                                            <span className="bg-green-100 px-2 py-1 rounded-full font-semibold text-xs">🏆 {gameState.maxStreak}</span>
                                            <span className="bg-purple-100 px-2 py-1 rounded-full font-semibold text-xs">💯 {userStats.highestScore}</span>
                                        </div>
                                        {gameState.gameMode === 'chase' && gameState.targetScore && (
                                            <div className="bg-gradient-to-r from-red-500 to-red-700 text-yellow-200 font-bold text-lg rounded-lg p-3 mt-2 shadow-lg border-2 border-yellow-400">
                                                🎯 TARGET: {gameState.targetScore} | NEED: {Math.max(0, gameState.targetScore - gameState.score + 1)} runs
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Commentary Box */}
                                {commentarySystem.currentComment && (
                                    <div className="mb-4 p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg border-l-4 border-blue-500">
                                        <div className="text-sm font-bold text-blue-800 flex items-center gap-2">
                                            <span className="text-lg">🎙️</span>
                                            Commentary
                                        </div>
                                        <div className="text-blue-700 mt-1">{commentarySystem.currentComment}</div>
                                    </div>
                                )}

                                {/* Power-ups Display */}
                                {(Object.values(gameState.powerUps).some(count => count > 0) || gameState.activePowerUp) && (
                                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 mb-6 border-2 border-purple-300">
                                        <h4 className="font-bold text-purple-800 mb-3 text-center">🎁 Power-ups</h4>
                                        <div className="grid grid-cols-3 gap-2">
                                            {Object.entries(enhancedPowerUps).map(([key, powerUp]) => (
                                                <button
                                                    key={key}
                                                    onClick={() => usePowerUp(key)}
                                                    disabled={gameState.powerUps[key] <= 0 || gameState.activePowerUp || gameState.isGameOver}
                                                    className={`p-2 rounded-lg text-center transition-all transform hover:scale-105 ${
                                                        gameState.activePowerUp === key ? 'bg-yellow-300 text-yellow-800 animate-pulse border-2 border-yellow-500' :
                                                            gameState.powerUps[key] > 0 ? 'bg-white text-purple-700 hover:bg-purple-50 shadow-md cursor-pointer border-2 border-purple-200' :
                                                                'bg-gray-200 text-gray-500 cursor-not-allowed opacity-50 border-2 border-gray-300'
                                                    }`}
                                                >
                                                    <div className="text-lg">{powerUp.icon}</div>
                                                    <div className="text-xs font-bold">{gameState.powerUps[key] || 0}</div>
                                                    {gameState.activePowerUp === key && <div className="text-xs text-yellow-700">ACTIVE</div>}
                                                    {key === 'doubleRuns' && gameState.activePowerUp === 'doubleRuns' && (
                                                        <div className="text-xs text-yellow-700">{gameState.doubleRunsRemaining || 3} left</div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                        {gameState.activePowerUp && (
                                            <div className="text-center mt-2 text-sm text-purple-700 font-bold">
                                                ✨ {enhancedPowerUps[gameState.activePowerUp]?.name} is active! ✨
                                            </div>
                                        )}

                                        {/* Power-up Suggestions */}
                                        {suggestPowerUp(gameState, weatherSystem.current) && (
                                            <div className="mt-2 p-2 bg-yellow-100 rounded-lg border border-yellow-300">
                                                <div className="text-xs text-yellow-800 text-center">
                                                    💡 {suggestPowerUp(gameState, weatherSystem.current).reason}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Enhanced Current Page Display */}
                                <div className={`bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-3xl p-6 mb-6 shadow-xl border-4 border-white transform transition-all duration-700 page-flip-3d ${
                                    isAnimating ? 'scale-110 rotate-3 shadow-2xl flipping' : 'scale-100 rotate-0'
                                }`}>
                                    <div className="text-center text-white">
                                        <div className="text-lg font-bold mb-2 opacity-90">📖 Current Page</div>
                                        <div className={`text-5xl font-bold mb-3 transition-all duration-700 ${
                                            isAnimating ? 'scale-150 text-yellow-300' : 'scale-100'
                                        }`}>
                                            {gameState.currentPage || '---'}
                                        </div>
                                        {gameState.lastDigit !== null && (
                                            <div className="text-sm opacity-90">
                                                Last digit: <span className="font-bold text-2xl text-yellow-300 bg-black bg-opacity-20 px-2 py-1 rounded-full">{gameState.lastDigit}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Enhanced Celebration */}
                                {celebration && (
                                    <div className="text-center mb-6">
                                        <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 bg-clip-text animate-bounce">
                                            {celebration}
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1 animate-pulse">
                                            {audioEnabled ? '🔊 Cricket atmosphere active' : '🔇 Enable audio for cricket sounds'}
                                        </div>
                                    </div>
                                )}

                                {/* Enhanced Turn Page Button */}
                                <button
                                    onClick={turnPage}
                                    disabled={gameState.isGameOver || isAnimating}
                                    className={`w-full py-5 rounded-3xl font-bold text-xl transition-all duration-300 transform shadow-2xl relative overflow-hidden ${
                                        gameState.isGameOver || isAnimating
                                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white hover:from-green-600 hover:via-blue-600 hover:to-purple-600 hover:scale-105 active:scale-95'
                                    } ${isAnimating ? 'animate-pulse' : ''}`}
                                >
                                    <div className="relative z-10">
                                        {gameState.isGameOver ? '🏁 Game Complete!' : isAnimating ? '📖 Turning Page...' : '📖 Turn the Page'}
                                    </div>
                                    {!gameState.isGameOver && !isAnimating && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
                                    )}
                                </button>

                                {/* Enhanced Recent Runs */}
                                {gameState.runs.length > 0 && (
                                    <div className="mt-6 p-5 bg-gradient-to-r from-gray-100 to-blue-100 rounded-3xl shadow-lg border-2 border-blue-200">
                                        <h3 className="font-bold text-gray-700 mb-3 text-lg flex items-center gap-2">
                                            📊 Recent Performance
                                            <span className="text-sm bg-blue-500 text-white px-2 py-1 rounded-full">
                                        Last {Math.min(12, gameState.runs.length)}
                                    </span>
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {gameState.runs.slice(-12).map((run, index) => (
                                                <span
                                                    key={index}
                                                    className={`px-3 py-2 rounded-full text-sm font-bold shadow-md transform hover:scale-110 transition-all cursor-default ${
                                                        run.isOut
                                                            ? 'bg-gradient-to-r from-red-400 to-red-600 text-white animate-pulse'
                                                            : run.runs >= 6
                                                                ? 'bg-gradient-to-r from-purple-400 to-pink-500 text-white shadow-lg'
                                                                : run.runs >= 4
                                                                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                                                                    : run.runs >= 1
                                                                        ? 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white'
                                                                        : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                                                    }`}
                                                    title={`Page: ${run.page}, ${run.isOut ? 'OUT' : run.runs === 0 ? 'Dot Ball' : run.runs + ' runs'}`}
                                                >
                                            {run.isOut ? 'OUT' : run.runs === 0 ? '•' : run.runs}
                                        </span>
                                            ))}
                                        </div>
                                        {gameState.runs.length > 0 && (
                                            <div className="mt-3 text-xs text-gray-600 bg-white rounded-lg p-2">
                                                <div className="flex justify-between">
                                                    <span>Boundaries: {gameState.runs.filter(r => r.runs >= 4 && !r.isOut).length}</span>
                                                    <span>Strike Rate: {Math.round((gameState.score / gameState.ballsFaced) * 100)}%</span>
                                                    <span>Dots: {gameState.runs.filter(r => r.runs === 0 && !r.isOut).length}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Modals */}
                    {showStats && <StatsModal />}
                    {showAchievements && <AchievementsModal />}
                    {showLeaderboard && <LeaderboardModal />}
                    {showSettings && <SettingsModal />}
                </div>
            </>
        );

    };

    export default BookCricket;