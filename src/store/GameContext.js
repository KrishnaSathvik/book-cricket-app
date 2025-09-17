import React, { createContext, useContext, useReducer, useEffect } from 'react';
import soundManager from '../utils/soundManager';

// Initial State
const initialState = {
  // Game State
  currentScreen: 'home',
  gameState: {
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
    maxBalls: null,
    timeLimit: null,
    playerName: 'Player 1',
    difficulty: 'medium',
    streak: 0,
    maxStreak: 0,
    startTime: null,
    endTime: null,
    gameOverReason: ''
  },
  
  // UI State
  selectedDifficulty: 'medium',
  selectedMode: 'single',
  audioEnabled: false,
  persistentMusicEnabled: false,
  showStats: false,
  showAchievements: false,
  showLeaderboard: false,
  isAnimating: false,
  celebration: null,
  
  // User Data
  userStats: {
    totalGamesPlayed: 0,
    totalRuns: 0,
    totalBallsFaced: 0,
    totalWickets: 0,
    totalBoundaries: 0,
    totalSixes: 0,
    totalDotBalls: 0,
    highestScore: 0,
    longestStreak: 0,
    averageScore: 0,
    strikeRate: 0,
    timePlayedMinutes: 0,
    lastPlayedDate: null,
    achievementsUnlocked: 0
  },
  
  achievements: {
    firstGame: false,
    centurion: false,
    sixMaster: false,
    boundaryKing: false,
    consistent: false,
    proPlayer: false
  },
  
  gameHistory: [],
  leaderboard: []
};

// Action Types
export const ActionTypes = {
  // Screen Navigation
  SET_CURRENT_SCREEN: 'SET_CURRENT_SCREEN',
  
  // Game Actions
  START_NEW_GAME: 'START_NEW_GAME',
  TURN_PAGE: 'TURN_PAGE',
  RESET_GAME: 'RESET_GAME',
  GAME_OVER: 'GAME_OVER',
  
  // UI Actions
  SET_SELECTED_DIFFICULTY: 'SET_SELECTED_DIFFICULTY',
  SET_SELECTED_MODE: 'SET_SELECTED_MODE',
  TOGGLE_AUDIO: 'TOGGLE_AUDIO',
  TOGGLE_MUSIC: 'TOGGLE_MUSIC',
  TOGGLE_MODAL: 'TOGGLE_MODAL',
  SET_ANIMATION: 'SET_ANIMATION',
  SET_CELEBRATION: 'SET_CELEBRATION',
  
  // User Data Actions
  UPDATE_USER_STATS: 'UPDATE_USER_STATS',
  UNLOCK_ACHIEVEMENT: 'UNLOCK_ACHIEVEMENT',
  ADD_GAME_TO_HISTORY: 'ADD_GAME_TO_HISTORY',
  UPDATE_LEADERBOARD: 'UPDATE_LEADERBOARD',
  
  // Data Management
  LOAD_USER_DATA: 'LOAD_USER_DATA',
  SAVE_USER_DATA: 'SAVE_USER_DATA',
  RESET_ALL_DATA: 'RESET_ALL_DATA'
};

// Reducer
const gameReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_CURRENT_SCREEN:
      return {
        ...state,
        currentScreen: action.payload
      };
    
    case ActionTypes.START_NEW_GAME:
      const mode = action.payload.mode || state.selectedMode;
      const difficulty = action.payload.difficulty || state.selectedDifficulty;
      
      // Set different game parameters based on mode
      let gameConfig = {
        gameMode: mode,
        difficulty: difficulty,
        startTime: action.payload.startTime || Date.now(),
        targetScore: null,
        maxBalls: null,
        timeLimit: null
      };
      
      switch (mode) {
        case 'single':
          // Quick Play: 25 balls, score maximum
          gameConfig.maxBalls = 25;
          break;
        case 'tournament':
          // Tournament: 50 balls, higher target
          gameConfig.maxBalls = 50;
          gameConfig.targetScore = 100; // Target to beat
          break;
        case 'timeAttack':
          // Time Attack: 2 minutes, score as much as possible
          gameConfig.timeLimit = 120; // 2 minutes in seconds
          break;
        default:
          gameConfig.maxBalls = 25;
      }
      
      // Play game start sound
      soundManager.playGameStartSound();
      
      return {
        ...state,
        gameState: {
          ...initialState.gameState,
          ...gameConfig
        },
        currentScreen: 'game'
      };
    
    case ActionTypes.TURN_PAGE:
      const currentDifficulty = state.gameState.difficulty;
      const newPage = Math.floor(Math.random() * 501); // Pages 0-500
      const newDigit = newPage % 10;
      const newRuns = [...state.gameState.runs];
      let newScore = state.gameState.score;
      let newWickets = state.gameState.wickets;
      let newBallsFaced = state.gameState.ballsFaced + 1;
      let newStreak = state.gameState.streak;
      let isOut = false;
      let runs = 0;
      
      // Apply new difficulty-based rules based on page numbers
      
      // Traditional cricket scoring based on last digit
      if (newDigit === 1) {
        runs = 1; // Single
      } else if (newDigit === 2) {
        runs = 2; // Double
      } else if (newDigit === 3) {
        runs = 3; // Triple
      } else if (newDigit === 4) {
        runs = 4; // Boundary
      } else if (newDigit === 6) {
        runs = 6; // Six
      } else {
        runs = 0; // Dot ball (0,5,7,8,9)
      }
      
      // Apply difficulty-based OUT conditions
      if (currentDifficulty === 'easy') {
        // EASY MODE: Only page 0 = OUT
        if (newPage === 0) {
          isOut = true;
        }
      } else if (currentDifficulty === 'medium') {
        // MEDIUM MODE: Any page ending with 0 = OUT (0,10,20,30,100,200...)
        if (newDigit === 0) {
          isOut = true;
        }
      } else if (currentDifficulty === 'hard') {
        // HARD MODE: Pages ending with 0 OR non-scoring digits (5,7,8,9) = OUT
        if (newDigit === 0 || newDigit === 5 || newDigit === 7 || newDigit === 8 || newDigit === 9) {
          isOut = true;
        }
      }
      
      // Update score and streak based on new rules
      if (isOut) {
        newWickets++;
        newStreak = 0;
      } else if (runs > 0) {
        newScore += runs;
        newStreak++;
      } else {
        newStreak = 0;
      }
      
      newRuns.push({
        page: newPage,
        digit: newDigit,
        runs: runs,
        isOut: isOut,
        timestamp: Date.now()
      });
      
      // Generate celebration message based on the result
      let celebrationMessage = '';
      if (isOut) {
        celebrationMessage = '😔 OUT! Better luck next time!';
        // Play out sound
        soundManager.playOutSound();
      } else if (runs === 1) {
        celebrationMessage = '🏃 ONE! Single run!';
        soundManager.playRunSound(1);
      } else if (runs === 2) {
        celebrationMessage = '🏃 TWO! Good running!';
        soundManager.playRunSound(2);
      } else if (runs === 3) {
        celebrationMessage = '🏃 THREE! Great running!';
        soundManager.playRunSound(3);
      } else if (runs === 4) {
        celebrationMessage = '🏏 FOUR! Beautiful boundary!';
        soundManager.playRunSound(4);
      } else if (runs === 5) {
        celebrationMessage = '🏏 FIVE! Rare boundary + overthrow!';
        soundManager.playRunSound(5);
      } else if (runs === 6) {
        celebrationMessage = '🎉 SIX! Over the boundary!';
        soundManager.playRunSound(6);
      } else if (runs === 0) {
        celebrationMessage = '⚪ Dot ball - no runs';
        soundManager.playRunSound(0);
      } else {
        celebrationMessage = `🏃 ${runs} runs!`;
        soundManager.playRunSound(runs);
      }
      
      // Play page turn sound
      soundManager.playPageTurnSound();
      
      // Check game over conditions based on mode
      let isGameOver = false;
      let gameOverReason = '';
      
      if (newWickets >= 10) {
        isGameOver = true;
        gameOverReason = 'All wickets lost!';
      } else if (state.gameState.maxBalls && newBallsFaced >= state.gameState.maxBalls) {
        isGameOver = true;
        gameOverReason = 'Balls finished!';
      } else if (state.gameState.timeLimit) {
        const timeElapsed = Math.floor((Date.now() - state.gameState.startTime) / 1000);
        if (timeElapsed >= state.gameState.timeLimit) {
          isGameOver = true;
          gameOverReason = 'Time up!';
        }
      } else if (state.gameState.targetScore && newScore >= state.gameState.targetScore) {
        isGameOver = true;
        gameOverReason = 'Target achieved!';
      }
      
      // Play game over sound if game just ended
      if (isGameOver && !state.gameState.isGameOver) {
        soundManager.playGameOverSound();
      }
      
      // Update statistics when game ends
      let updatedUserStats = state.userStats;
      if (isGameOver && !state.gameState.isGameOver) {
        const gameDuration = Math.floor((Date.now() - state.gameState.startTime) / 1000);
        const strikeRate = newBallsFaced > 0 ? Math.round((newScore / newBallsFaced) * 100) : 0;
        const boundaries = newRuns.filter(r => r.runs >= 4 && !r.isOut).length;
        const sixes = newRuns.filter(r => r.runs === 6 && !r.isOut).length;
        const dotBalls = newRuns.filter(r => r.runs === 0 && !r.isOut).length;
        
        updatedUserStats = {
          ...state.userStats,
          totalGamesPlayed: state.userStats.totalGamesPlayed + 1,
          totalRuns: state.userStats.totalRuns + newScore,
          totalBallsFaced: state.userStats.totalBallsFaced + newBallsFaced,
          totalWickets: state.userStats.totalWickets + newWickets,
          totalBoundaries: state.userStats.totalBoundaries + boundaries,
          totalSixes: state.userStats.totalSixes + sixes,
          totalDotBalls: state.userStats.totalDotBalls + dotBalls,
          timePlayedMinutes: state.userStats.timePlayedMinutes + Math.round(gameDuration / 60),
          highestScore: Math.max(state.userStats.highestScore, newScore),
          longestStreak: Math.max(state.userStats.longestStreak, Math.max(state.gameState.maxStreak, newStreak)),
          averageScore: Math.round((state.userStats.totalRuns + newScore) / (state.userStats.totalGamesPlayed + 1)),
          strikeRate: Math.round(((state.userStats.totalRuns + newScore) / (state.userStats.totalBallsFaced + newBallsFaced)) * 100),
          lastPlayedDate: new Date().toISOString()
        };
        
        // Debug log to check total runs calculation
        console.log('Game Over - Stats Update:', {
          previousTotalRuns: state.userStats.totalRuns,
          currentGameScore: newScore,
          newTotalRuns: updatedUserStats.totalRuns,
          totalGamesPlayed: updatedUserStats.totalGamesPlayed
        });
        
        // Add game to history
        const gameHistory = [{
          id: Date.now(),
          score: newScore,
          wickets: newWickets,
          ballsFaced: newBallsFaced,
          gameMode: state.gameState.gameMode,
          difficulty: state.gameState.difficulty,
          duration: gameDuration,
          boundaries: boundaries,
          sixes: sixes,
          dotBalls: dotBalls,
          strikeRate: strikeRate,
          gameOverReason: gameOverReason,
          timestamp: Date.now()
        }, ...state.gameHistory].slice(0, 50); // Keep only last 50 games
        
        // Check and unlock achievements
        const newAchievements = { ...state.achievements };
        let achievementsUnlocked = 0;
        
        // First Game Achievement
        if (updatedUserStats.totalGamesPlayed === 1 && !newAchievements.firstGame) {
          newAchievements.firstGame = true;
          achievementsUnlocked++;
        }
        
        // Century Achievement
        if (newScore >= 100 && !newAchievements.centurion) {
          newAchievements.centurion = true;
          achievementsUnlocked++;
        }
        
        // Six Master Achievement
        if (updatedUserStats.totalSixes >= 10 && !newAchievements.sixMaster) {
          newAchievements.sixMaster = true;
          achievementsUnlocked++;
        }
        
        // Boundary King Achievement
        if (updatedUserStats.totalBoundaries >= 25 && !newAchievements.boundaryKing) {
          newAchievements.boundaryKing = true;
          achievementsUnlocked++;
        }
        
        // Consistent Player Achievement
        if (updatedUserStats.totalGamesPlayed >= 10 && !newAchievements.consistent) {
          newAchievements.consistent = true;
          achievementsUnlocked++;
        }
        
        // Pro Player Achievement
        if (updatedUserStats.strikeRate >= 80 && !newAchievements.proPlayer) {
          newAchievements.proPlayer = true;
          achievementsUnlocked++;
        }
        
        // Update achievements count
        updatedUserStats.achievementsUnlocked = state.userStats.achievementsUnlocked + achievementsUnlocked;
        
        // Save updated statistics to localStorage
        try {
          localStorage.setItem('bookCricketStats', JSON.stringify(updatedUserStats));
          localStorage.setItem('bookCricketHistory', JSON.stringify(gameHistory));
          localStorage.setItem('bookCricketAchievements', JSON.stringify(newAchievements));
        } catch (error) {
          console.error('Error saving statistics:', error);
        }
        
        return {
          ...state,
          gameState: {
            ...state.gameState,
            currentPage: newPage,
            lastDigit: newDigit,
            score: newScore,
            wickets: newWickets,
            ballsFaced: newBallsFaced,
            streak: newStreak,
            maxStreak: Math.max(state.gameState.maxStreak, newStreak),
            runs: newRuns,
            isGameOver: isGameOver,
            gameOverReason: gameOverReason,
            endTime: Date.now()
          },
          userStats: updatedUserStats,
          gameHistory: gameHistory,
          achievements: newAchievements,
          celebration: celebrationMessage
        };
      }
      
      return {
        ...state,
        gameState: {
          ...state.gameState,
          currentPage: newPage,
          lastDigit: newDigit,
          score: newScore,
          wickets: newWickets,
          ballsFaced: newBallsFaced,
          streak: newStreak,
          maxStreak: Math.max(state.gameState.maxStreak, newStreak),
          runs: newRuns,
          isGameOver: isGameOver,
          gameOverReason: gameOverReason
        },
        celebration: celebrationMessage
      };
    
    case ActionTypes.RESET_GAME:
      return {
        ...state,
        gameState: initialState.gameState
      };
    
    case ActionTypes.GAME_OVER:
      return {
        ...state,
        gameState: {
          ...state.gameState,
          isGameOver: true,
          endTime: Date.now()
        },
        currentScreen: 'gameOver'
      };
    
    case ActionTypes.SET_SELECTED_DIFFICULTY:
      return {
        ...state,
        selectedDifficulty: action.payload
      };
    
    case ActionTypes.SET_SELECTED_MODE:
      return {
        ...state,
        selectedMode: action.payload
      };
    
    case ActionTypes.TOGGLE_AUDIO:
      return {
        ...state,
        audioEnabled: !state.audioEnabled
      };
    
    case ActionTypes.TOGGLE_MUSIC:
      return {
        ...state,
        persistentMusicEnabled: !state.persistentMusicEnabled
      };
    
    case ActionTypes.TOGGLE_MODAL:
      return {
        ...state,
        [action.payload]: !state[action.payload]
      };
    
    case ActionTypes.SET_ANIMATION:
      return {
        ...state,
        isAnimating: action.payload
      };
    
    case ActionTypes.SET_CELEBRATION:
      return {
        ...state,
        celebration: action.payload
      };
    
    case ActionTypes.UPDATE_USER_STATS:
      return {
        ...state,
        userStats: {
          ...state.userStats,
          ...action.payload
        }
      };
    
    case ActionTypes.UNLOCK_ACHIEVEMENT:
      return {
        ...state,
        achievements: {
          ...state.achievements,
          [action.payload]: true
        }
      };
    
    case ActionTypes.ADD_GAME_TO_HISTORY:
      return {
        ...state,
        gameHistory: [action.payload, ...state.gameHistory].slice(0, 50) // Keep only last 50 games
      };
    
    case ActionTypes.UPDATE_LEADERBOARD:
      return {
        ...state,
        leaderboard: action.payload
      };
    
    case ActionTypes.LOAD_USER_DATA:
      return {
        ...state,
        ...action.payload
      };
    
    case ActionTypes.RESET_ALL_DATA:
      return {
        ...state,
        userStats: initialState.userStats,
        achievements: initialState.achievements,
        gameHistory: [],
        leaderboard: []
      };
    
    default:
      return state;
  }
};

// Context
const GameContext = createContext();

// Provider Component
export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('bookCricketData');
    const savedStats = localStorage.getItem('bookCricketStats');
    const savedAchievements = localStorage.getItem('bookCricketAchievements');
    const savedHistory = localStorage.getItem('bookCricketHistory');
    
    if (savedData || savedStats || savedAchievements || savedHistory) {
      try {
        const parsedData = savedData ? JSON.parse(savedData) : {};
        const parsedStats = savedStats ? JSON.parse(savedStats) : {};
        const parsedAchievements = savedAchievements ? JSON.parse(savedAchievements) : {};
        const parsedHistory = savedHistory ? JSON.parse(savedHistory) : [];
        
        dispatch({
          type: ActionTypes.LOAD_USER_DATA,
          payload: {
            ...parsedData,
            userStats: { 
              ...initialState.userStats,
              ...parsedData.userStats, 
              ...parsedStats 
            },
            achievements: { 
              ...initialState.achievements,
              ...parsedData.achievements, 
              ...parsedAchievements 
            },
            gameHistory: parsedHistory
          }
        });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    const dataToSave = {
      userStats: state.userStats,
      achievements: state.achievements,
      gameHistory: state.gameHistory,
      leaderboard: state.leaderboard,
      selectedDifficulty: state.selectedDifficulty,
      selectedMode: state.selectedMode,
      audioEnabled: state.audioEnabled,
      persistentMusicEnabled: state.persistentMusicEnabled
    };
    
    localStorage.setItem('bookCricketData', JSON.stringify(dataToSave));
  }, [state.userStats, state.achievements, state.gameHistory, state.leaderboard, state.selectedDifficulty, state.selectedMode, state.audioEnabled, state.persistentMusicEnabled]);

  // Action Creators
  const actions = {
    setCurrentScreen: (screen) => dispatch({ type: ActionTypes.SET_CURRENT_SCREEN, payload: screen }),
    
    startNewGame: (options = {}) => dispatch({ type: ActionTypes.START_NEW_GAME, payload: options }),
    turnPage: () => dispatch({ type: ActionTypes.TURN_PAGE }),
    resetGame: () => dispatch({ type: ActionTypes.RESET_GAME }),
    gameOver: () => dispatch({ type: ActionTypes.GAME_OVER }),
    
    setSelectedDifficulty: (difficulty) => dispatch({ type: ActionTypes.SET_SELECTED_DIFFICULTY, payload: difficulty }),
    setSelectedMode: (mode) => dispatch({ type: ActionTypes.SET_SELECTED_MODE, payload: mode }),
    toggleAudio: () => {
      const newState = !state.audioEnabled;
      soundManager.isEnabled = newState;
      dispatch({ type: ActionTypes.TOGGLE_AUDIO });
    },
    toggleMusic: () => dispatch({ type: ActionTypes.TOGGLE_MUSIC }),
    setSoundVolume: (volume) => {
      soundManager.setVolume(volume);
    },
    toggleSound: () => {
      const isEnabled = soundManager.toggleSound();
      return isEnabled;
    },
    initializeAudio: () => {
      soundManager.initializeOnUserInteraction();
    },
    toggleModal: (modalName) => dispatch({ type: ActionTypes.TOGGLE_MODAL, payload: modalName }),
    setAnimation: (isAnimating) => dispatch({ type: ActionTypes.SET_ANIMATION, payload: isAnimating }),
    setCelebration: (celebration) => dispatch({ type: ActionTypes.SET_CELEBRATION, payload: celebration }),
    
    updateUserStats: (stats) => dispatch({ type: ActionTypes.UPDATE_USER_STATS, payload: stats }),
    unlockAchievement: (achievement) => dispatch({ type: ActionTypes.UNLOCK_ACHIEVEMENT, payload: achievement }),
    addGameToHistory: (game) => dispatch({ type: ActionTypes.ADD_GAME_TO_HISTORY, payload: game }),
    updateLeaderboard: (leaderboard) => dispatch({ type: ActionTypes.UPDATE_LEADERBOARD, payload: leaderboard }),
    
    resetAllData: () => dispatch({ type: ActionTypes.RESET_ALL_DATA })
  };

  const value = {
    state,
    actions
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

// Custom Hook
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export default GameContext;
