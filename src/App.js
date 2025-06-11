import React, { useState } from 'react';
import { BookOpen, RotateCcw, Trophy, Target, Star, Medal, Settings, Volume2, VolumeX } from 'lucide-react';
import * as Tone from 'tone';

const BookCricket = () => {
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
    maxStreak: 0
  });

  const [showRules, setShowRules] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [gameHistory, setGameHistory] = useState([]);
  const [celebration, setCelebration] = useState('');
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
    nightmare: false
  });
  const [newAchievement, setNewAchievement] = useState('');
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [backgroundMusicEnabled, setBgMusicEnabled] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);

  // Audio setup
  const [sounds, setSounds] = useState({});
  const [backgroundMusic, setBackgroundMusic] = useState(null);

  // Difficulty settings
  const difficulties = {
    easy: {
      name: 'Easy',
      description: 'More runs, fewer outs',
      outDigits: [0, 9],
      bonusRuns: true,
      color: 'green'
    },
    medium: {
      name: 'Medium',
      description: 'Classic book cricket',
      outDigits: [0, 7, 8, 9],
      bonusRuns: false,
      color: 'blue'
    },
    hard: {
      name: 'Hard',
      description: 'High risk, high reward',
      outDigits: [0, 6, 7, 8, 9],
      bonusRuns: false,
      color: 'red'
    },
    nightmare: {
      name: 'Nightmare',
      description: 'For the brave only',
      outDigits: [0, 5, 6, 7, 8, 9],
      bonusRuns: false,
      color: 'purple'
    }
  };

  // Achievement definitions
  const achievementDefs = {
    firstSix: { name: 'First Six!', desc: 'Hit your first six', icon: '🎯', color: 'green' },
    centurion: { name: 'Centurion', desc: 'Score 100+ runs', icon: '💯', color: 'blue' },
    ballOfFire: { name: 'Ball of Fire', desc: 'Hit 3 sixes in a row', icon: '🔥', color: 'orange' },
    survivor: { name: 'Survivor', desc: 'Face 50+ balls without getting out', icon: '🛡️', color: 'purple' },
    chasemaster: { name: 'Chase Master', desc: 'Successfully chase 3 targets', icon: '🎯', color: 'red' },
    streakking: { name: 'Streak King', desc: 'Score runs in 10 consecutive balls', icon: '⚡', color: 'yellow' },
    quickfire: { name: 'Quickfire', desc: 'Score 50 runs in under 20 balls', icon: '💨', color: 'cyan' },
    boundary: { name: 'Boundary King', desc: 'Hit 10 fours in a game', icon: '🏏', color: 'indigo' },
    legend: { name: 'Legend', desc: 'Score 200+ runs', icon: '👑', color: 'gold' },
    nightmare: { name: 'Nightmare Survivor', desc: 'Score 25+ in nightmare mode', icon: '💀', color: 'black' }
  };

  // Initialize audio system
  const initializeAudio = async () => {
    if (audioInitialized) return;

    try {
      await Tone.start();

      // Create cricket sounds using Tone.js
      const batSound = new Tone.Player().toDestination();
      const crowdCheer = new Tone.Noise("white").toDestination();
      const crowdOoh = new Tone.Noise("pink").toDestination();
      const boundarySound = new Tone.Oscillator(440, "sine").toDestination();
      const sixSound = new Tone.Oscillator(880, "square").toDestination();
      const outSound = new Tone.Noise("brown").toDestination();

      // Create background music loop
      const bgMusic = new Tone.Loop((time) => {
        const notes = ["C4", "E4", "G4", "C5", "G4", "E4"];
        const note = notes[Math.floor(Math.random() * notes.length)];
        const synth = new Tone.Synth().toDestination();
        synth.triggerAttackRelease(note, "8n", time);
      }, "2n");

      setSounds({
        batSound,
        crowdCheer,
        crowdOoh,
        boundarySound,
        sixSound,
        outSound
      });

      setBackgroundMusic(bgMusic);
      setAudioInitialized(true);
    } catch (error) {
      console.log("Audio initialization failed:", error);
    }
  };

  // Play sound effects
  const playSound = (soundType, runs = 0, isOut = false) => {
    if (!audioEnabled || !audioInitialized) return;

    try {
      if (isOut) {
        sounds.outSound?.start();
        sounds.outSound?.stop("+0.3");
        sounds.crowdOoh?.start();
        sounds.crowdOoh?.stop("+1");
      } else if (runs === 6) {
        sounds.sixSound?.start();
        sounds.sixSound?.stop("+0.5");
        sounds.crowdCheer?.start();
        sounds.crowdCheer?.stop("+3");
        setTimeout(() => {
          if (sounds.boundarySound) {
            sounds.boundarySound.frequency.setValueAtTime(660, Tone.now());
            sounds.boundarySound.start();
            sounds.boundarySound.stop("+0.3");
          }
        }, 500);
      } else if (runs === 4) {
        sounds.boundarySound?.start();
        sounds.boundarySound?.stop("+0.4");
        sounds.crowdCheer?.start();
        sounds.crowdCheer?.stop("+2");
      } else if (runs > 0) {
        sounds.batSound?.start();
        sounds.batSound?.stop("+0.2");
        if (runs >= 2) {
          sounds.crowdCheer?.start();
          sounds.crowdCheer?.stop("+1");
        }
      }
    } catch (error) {
      console.log("Sound playback failed:", error);
    }
  };

  // Toggle background music
  const toggleBackgroundMusic = () => {
    if (!audioInitialized) return;

    try {
      if (backgroundMusicEnabled) {
        backgroundMusic?.stop();
        setBgMusicEnabled(false);
      } else {
        backgroundMusic?.start();
        setBgMusicEnabled(true);
      }
    } catch (error) {
      console.log("Background music toggle failed:", error);
    }
  };

  // Enable audio
  const enableAudio = async () => {
    if (!audioInitialized) {
      await initializeAudio();
    }
    setAudioEnabled(true);
  };

  // Get scoring rules based on difficulty
  const getScoreFromDigit = (digit) => {
    const diff = difficulties[gameState.difficulty];
    const isOut = diff.outDigits.includes(digit);

    if (isOut) {
      return { runs: 0, isOut: true };
    }

    let runs = digit === 0 ? 0 : digit;

    if (diff.bonusRuns && digit >= 4) {
      runs += 1;
    }

    return { runs, isOut: false };
  };

  // Check achievements
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

    if (!achievements.ballOfFire) {
      const lastThree = newState.runs.slice(-3);
      if (lastThree.length === 3 && lastThree.every(r => r.runs === 6)) {
        newAchievements.ballOfFire = true;
        achievementUnlocked = 'ballOfFire';
      }
    }

    if (!achievements.survivor && newState.ballsFaced >= 50 && newState.wickets === 0) {
      newAchievements.survivor = true;
      achievementUnlocked = 'survivor';
    }

    if (!achievements.quickfire && newState.score >= 50 && newState.ballsFaced <= 20) {
      newAchievements.quickfire = true;
      achievementUnlocked = 'quickfire';
    }

    if (!achievements.boundary && newState.runs.filter(r => r.runs === 4).length >= 10) {
      newAchievements.boundary = true;
      achievementUnlocked = 'boundary';
    }

    if (!achievements.nightmare && newState.difficulty === 'nightmare' && newState.score >= 25) {
      newAchievements.nightmare = true;
      achievementUnlocked = 'nightmare';
    }

    if (achievementUnlocked) {
      setAchievements(newAchievements);
      setNewAchievement(achievementUnlocked);
      setTimeout(() => setNewAchievement(''), 4000);
    }
  };

  const turnPage = () => {
    if (gameState.isGameOver) return;

    const newPage = Math.floor(Math.random() * gameState.totalPages) + 1;
    const lastDigit = newPage % 10;
    const scoreResult = getScoreFromDigit(lastDigit);

    const newScore = gameState.score + scoreResult.runs;
    const newWickets = scoreResult.isOut ? gameState.wickets + 1 : gameState.wickets;
    const newBalls = gameState.ballsFaced + 1;
    const newStreak = scoreResult.runs > 0 ? gameState.streak + 1 : 0;
    const newMaxStreak = Math.max(gameState.maxStreak, newStreak);

    playSound('hit', scoreResult.runs, scoreResult.isOut);

    const isGameOver = newWickets >= 10 ||
        (gameState.gameMode === 'chase' && newScore > gameState.targetScore);

    if (scoreResult.runs === 6) {
      setCelebration('💥 SIX! BOOM! 💥');
      setTimeout(() => setCelebration(''), 2500);
    } else if (scoreResult.runs === 4) {
      setCelebration('🏏 FOUR! Beautiful! 🏏');
      setTimeout(() => setCelebration(''), 2000);
    } else if (scoreResult.isOut) {
      setCelebration('💀 OUT! Oh no! 💀');
      setTimeout(() => setCelebration(''), 2000);
    } else if (scoreResult.runs > 0 && newStreak >= 5) {
      setCelebration('🔥 ON FIRE! 🔥');
      setTimeout(() => setCelebration(''), 1500);
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
      runs: [...gameState.runs, { runs: scoreResult.runs, isOut: scoreResult.isOut, page: newPage }]
    };

    setGameState(newState);
    checkAchievements(newState);

    if (isGameOver) {
      setGameHistory(prev => [...prev, {
        score: newScore,
        wickets: newWickets,
        balls: newBalls,
        difficulty: gameState.difficulty,
        date: new Date().toLocaleDateString()
      }]);
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
      maxStreak: prev.maxStreak
    }));
    setCelebration('');
  };

  const setChaseTarget = () => {
    const target = prompt("Enter target score to chase:");
    if (target && !isNaN(target)) {
      setGameState(prev => ({
        ...prev,
        targetScore: parseInt(target),
        gameMode: 'chase'
      }));
      resetGame();
    }
  };

  const changeDifficulty = (difficulty) => {
    setGameState(prev => ({ ...prev, difficulty }));
    setShowSettings(false);
  };

  const achievementCount = Object.values(achievements).filter(Boolean).length;

  return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-2 sm:p-4">
        {/* New Achievement Popup */}
        {newAchievement && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl p-6 max-w-sm w-full mx-4 text-center animate-bounce shadow-2xl">
                <div className="text-6xl mb-4">{achievementDefs[newAchievement].icon}</div>
                <h3 className="text-2xl font-bold text-yellow-600 mb-2">Achievement Unlocked!</h3>
                <p className="text-lg font-semibold">{achievementDefs[newAchievement].name}</p>
                <p className="text-gray-600">{achievementDefs[newAchievement].desc}</p>
              </div>
            </div>
        )}

        {/* Main Container */}
        <div className="max-w-md mx-auto bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-amber-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-4 sm:p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"20\" cy=\"20\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
          <div className="relative flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8" />
                <h1 className="text-xl sm:text-2xl font-bold">Book Cricket</h1>
              </div>
              <p className="text-amber-100 text-xs sm:text-sm">Relive your school days!</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-1 bg-${difficulties[gameState.difficulty].color}-500 rounded-full text-xs font-bold`}>
                  {difficulties[gameState.difficulty].name}
                </span>
                <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-bold">
                  🏆 {achievementCount}/10
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                  onClick={() => setShowAchievements(true)}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
              >
                <Trophy className="w-5 h-5" />
              </button>
              <button
                  onClick={() => setShowSettings(true)}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                  onClick={audioEnabled ? () => setAudioEnabled(false) : enableAudio}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
              >
                {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Score Display */}
        <div className="p-4 sm:p-6 bg-gradient-to-b from-white to-amber-50">
          <div className="text-center mb-4 sm:mb-6">
            <div className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
              {gameState.score}/{gameState.wickets}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 space-y-1">
              <div>Balls: {gameState.ballsFaced} | Streak: {gameState.streak} | Best: {gameState.maxStreak}</div>
              {gameState.gameMode === 'chase' && gameState.targetScore && (
                  <div className="text-orange-600 font-semibold">
                    Target: {gameState.targetScore} | Need: {Math.max(0, gameState.targetScore - gameState.score + 1)}
                  </div>
              )}
            </div>
          </div>

          {/* Current Page Display */}
          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl p-4 mb-4 border-2 border-dashed border-blue-300">
            <div className="text-center">
              <div className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Current Page</div>
              <div className="text-2xl sm:text-3xl font-bold text-blue-700">
                {gameState.currentPage || '---'}
              </div>
              {gameState.lastDigit !== null && (
                  <div className="mt-2 text-sm text-gray-600">
                    Last digit: <span className="font-bold text-lg">{gameState.lastDigit}</span>
                  </div>
              )}
            </div>
          </div>

          {/* Celebration */}
          {celebration && (
              <div className="text-center mb-4 text-lg sm:text-2xl font-bold text-orange-600 animate-pulse">
                {celebration}
              </div>
          )}

          {/* Turn Page Button */}
          <button
              onClick={turnPage}
              disabled={gameState.isGameOver}
              className={`w-full py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 transform active:scale-95 ${
                  gameState.isGameOver
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:scale-105 shadow-lg hover:shadow-xl'
              }`}
          >
            {gameState.isGameOver ? 'Game Over!' : '📖 Turn Page'}
          </button>

          {/* Game Over Message */}
          {gameState.isGameOver && (
              <div className="mt-4 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl text-center border-2 border-purple-300">
                <Trophy className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-purple-600" />
                <div className="font-bold text-purple-800 text-sm sm:text-base">
                  {gameState.gameMode === 'chase' && gameState.score > gameState.targetScore
                      ? `🎉 Target Chased! Won by ${10 - gameState.wickets} wickets!`
                      : gameState.gameMode === 'chase' && gameState.wickets >= 10
                          ? `💔 Target Missed! Lost by ${gameState.targetScore - gameState.score} runs!`
                          : `Final Score: ${gameState.score}/${gameState.wickets} in ${gameState.ballsFaced} balls`
                  }
                </div>
              </div>
          )}

          {/* Controls */}
          <div className="mt-4 sm:mt-6 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <button
                  onClick={resetGame}
                  className="py-2 sm:py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <RotateCcw className="w-4 h-4" />
                New Game
              </button>
              <button
                  onClick={setChaseTarget}
                  className="py-2 sm:py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Target className="w-4 h-4" />
                Chase
              </button>
            </div>

            <button
                onClick={() => setShowRules(!showRules)}
                className="w-full py-2 sm:py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors text-sm sm:text-base"
            >
              {showRules ? 'Hide Rules' : 'Show Rules'}
            </button>
          </div>

          {/* Rules */}
          {showRules && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-2xl border-2 border-yellow-200">
                <h3 className="font-bold text-yellow-800 mb-2 text-sm sm:text-base">📋 How to Play</h3>
                <div className="text-xs sm:text-sm text-yellow-700 space-y-1">
                  <p>• Tap "Turn Page" to get a random page number</p>
                  <p>• Score runs based on the last digit and difficulty:</p>
                  <div className="ml-4 space-y-1">
                    <p><strong>Easy:</strong> Only 0,9 are out. Bonus runs for 4+</p>
                    <p><strong>Medium:</strong> 0,7,8,9 are out (classic)</p>
                    <p><strong>Hard:</strong> 0,6,7,8,9 are out</p>
                    <p><strong>Nightmare:</strong> 0,5,6,7,8,9 are out!</p>
                  </div>
                  <p>• Game ends when you get 10 wickets</p>
                  <p>• Unlock achievements by playing!</p>
                </div>
              </div>
          )}

          {/* Recent Runs */}
          {gameState.runs.length > 0 && (
              <div className="mt-4 p-4 bg-gray-50 rounded-2xl">
                <h3 className="font-bold text-gray-700 mb-2 text-sm sm:text-base">Recent Scores</h3>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {gameState.runs.slice(-12).map((run, index) => (
                      <span
                          key={index}
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${
                              run.isOut
                                  ? 'bg-red-200 text-red-800'
                                  : run.runs >= 6
                                      ? 'bg-purple-200 text-purple-800'
                                      : run.runs >= 4
                                          ? 'bg-green-200 text-green-800'
                                          : 'bg-blue-200 text-blue-800'
                          }`}
                      >
                    {run.isOut ? 'OUT' : run.runs}
                  </span>
                  ))}
                </div>
              </div>
          )}

          {/* Game History */}
          {gameHistory.length > 0 && (
              <div className="mt-4 p-4 bg-indigo-50 rounded-2xl">
                <h3 className="font-bold text-indigo-700 mb-2 text-sm sm:text-base">🏆 Previous Games</h3>
                <div className="space-y-1 text-xs sm:text-sm">
                  {gameHistory.slice(-3).map((game, index) => (
                      <div key={index} className="text-indigo-600 flex justify-between">
                        <span>{game.score}/{game.wickets} ({game.balls}b)</span>
                        <span className="text-gray-500">{game.difficulty} - {game.date}</span>
                      </div>
                  ))}
                </div>
              </div>
          )}
        </div>
      </div>

  {/* Settings Modal */}
  {showSettings && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
        <div className="bg-white rounded-3xl p-6 max-w-sm w-full mx-4 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Settings</h2>
            <button
                onClick={() => setShowSettings(false)}
                className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-gray-700">Difficulty Level</h3>
            {Object.entries(difficulties).map(([key, diff]) => (
                <button
                    key={key}
                    onClick={() => changeDifficulty(key)}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                        gameState.difficulty === key
                            ? `border-${diff.color}-500 bg-${diff.color}-50`
                            : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold">{diff.name}</div>
                      <div className="text-sm text-gray-600">{diff.description}</div>
                    </div>
                    {gameState.difficulty === key && <Star className="w-5 h-5 text-yellow-500" />}
                  </div>
                </button>
            ))}

            <div className="border-t pt-4">
              <h3 className="font-bold text-gray-700 mb-3">Audio Settings</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-semibold">Sound Effects</div>
                    <div className="text-sm text-gray-600">Cricket sounds & crowd reactions</div>
                  </div>
                  <button
                      onClick={audioEnabled ? () => setAudioEnabled(false) : enableAudio}
                      className={`w-12 h-6 rounded-full transition-colors ${
                          audioEnabled ? 'bg-green-500' : 'bg-gray-300'
                      } relative`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                        audioEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-semibold">Background Music</div>
                    <div className="text-sm text-gray-600">Ambient cricket stadium music</div>
                  </div>
                  <button
                      onClick={toggleBackgroundMusic}
                      disabled={!audioEnabled}
                      className={`w-12 h-6 rounded-full transition-colors ${
                          backgroundMusicEnabled && audioEnabled ? 'bg-blue-500' : 'bg-gray-300'
                      } relative ${!audioEnabled ? 'opacity-50' : ''}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                        backgroundMusicEnabled && audioEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                {!audioEnabled && (
                    <div className="text-xs text-gray-500 text-center p-2 bg-yellow-50 rounded-lg">
                      💡 Enable sound effects first to use background music
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  )}

  {/* Achievements Modal */}
  {showAchievements && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
        <div className="bg-white rounded-3xl p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Achievements ({achievementCount}/10)
            </h2>
            <button
                onClick={() => setShowAchievements(false)}
                className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="grid gap-3">
            {Object.entries(achievementDefs).map(([key, achievement]) => (
                <div
                    key={key}
                    className={`p-4 rounded-2xl border-2 transition-all ${
                        achievements[key]
                            ? `border-${achievement.color}-400 bg-${achievement.color}-50`
                            : 'border-gray-200 bg-gray-50 opacity-60'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-800">{achievement.name}</div>
                      <div className="text-sm text-gray-600">{achievement.desc}</div>
                    </div>
                    {achievements[key] && <Medal className="w-5 h-5 text-yellow-500" />}
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
  )}
</div>
);
};

export default BookCricket;