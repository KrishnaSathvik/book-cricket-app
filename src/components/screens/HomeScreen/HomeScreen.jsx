import React from 'react';
import { useGame } from '../../../store/GameContext';
import { 
  Trophy, 
  Clock, 
  Play,
  Home,
  BarChart3,
  Target
} from 'lucide-react';
import './HomeScreen.css';

const HomeScreen = () => {
  const { state, actions } = useGame();

  const gameModes = [
    {
      id: 'single',
      name: 'Quick Play',
      description: '25 balls • Score maximum runs',
      icon: <Play size={24} />,
      color: 'primary'
    },
    {
      id: 'tournament',
      name: 'Tournament',
      description: '50 balls • Target: 100 runs',
      icon: <Trophy size={24} />,
      color: 'warning'
    },
    {
      id: 'timeAttack',
      name: 'Time Attack',
      description: '2 minutes • Score as much as possible',
      icon: <Clock size={24} />,
      color: 'error'
    }
  ];


  const handleStartGame = (mode) => {
    // Initialize audio on first user interaction
    actions.initializeAudio();
    
    actions.setSelectedMode(mode);
    actions.startNewGame({
      mode,
      difficulty: state.selectedDifficulty,
      startTime: Date.now()
    });
    actions.setCurrentScreen('game');
  };

  const handleDifficultyChange = (difficulty) => {
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
    actions.setSelectedDifficulty(difficulty);
  };

  const handleNavigation = (screen) => {
    // Haptic feedback for navigation
    if (navigator.vibrate) {
      navigator.vibrate(50); // Short vibration
    }
    
    // Handle navigation to different screens
    actions.setCurrentScreen(screen);
  };

  const handleCardPress = (mode) => {
    // Haptic feedback for card press
    if (navigator.vibrate) {
      navigator.vibrate(30); // Very short vibration
    }
    
    handleStartGame(mode);
  };

  return (
    <div className="home-screen home-content">
      {/* Header */}
      <div className="home-header">
        <div className="header-spacer"></div>
      </div>

      {/* Main Content */}
      <div className="home-content nb-container">
        {/* Main Welcome Header */}
        <div className="nb-card">
          <div style={{ padding: 'var(--nb-space-8)', textAlign: 'center' }}>
            <h1 className="nb-title">🏏 Book Cricket</h1>
            <div className="nb-subtitle">Turn any book into an exciting cricket match</div>
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="nb-card">
          <div style={{ padding: 'var(--nb-space-6)' }}>
            <h2 className="nb-heading">🎯 Choose Difficulty</h2>
            <div className="nb-subtitle">Select your challenge level</div>
            
            <div style={{ marginTop: 'var(--nb-space-6)' }}>
              {[
                { id: 'easy', name: 'Easy', color: 'var(--nb-cricket-green)', description: 'Only page 0 = OUT', icon: '🛡️' },
                { id: 'medium', name: 'Medium', color: 'var(--nb-orange)', description: 'Pages ending in 0 = OUT', icon: '🎯' },
                { id: 'hard', name: 'Hard', color: 'var(--nb-red)', description: 'Pages ending in 0,5,7,8,9 = OUT', icon: '⚡' }
              ].map((difficulty) => (
                <div
                  key={difficulty.id}
                  className="nb-card nb-card-interactive"
                  style={{ 
                    marginBottom: 'var(--nb-space-4)',
                    borderColor: state.selectedDifficulty === difficulty.id ? difficulty.color : 'var(--nb-black)',
                    borderWidth: state.selectedDifficulty === difficulty.id ? '6px' : '4px'
                  }}
                  onClick={() => handleDifficultyChange(difficulty.id)}
                >
                  <div style={{ padding: 'var(--nb-space-4)', display: 'flex', alignItems: 'center', gap: 'var(--nb-space-4)' }}>
                    <div style={{ fontSize: 'var(--nb-text-2xl)' }}>{difficulty.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div className="nb-text" style={{ fontWeight: '700', fontSize: 'var(--nb-text-lg)' }}>{difficulty.name}</div>
                      <div className="nb-text" style={{ fontSize: 'var(--nb-text-sm)' }}>{difficulty.description}</div>
                    </div>
                    <div style={{ fontSize: 'var(--nb-text-xl)' }}>
                      {state.selectedDifficulty === difficulty.id ? '✅' : '⚪'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Game Modes Section */}
        <div className="nb-card">
          <div style={{ padding: 'var(--nb-space-6)' }}>
            <h2 className="nb-heading">🎮 Choose Your Game Mode</h2>
            <div className="nb-subtitle">Select how you want to play</div>
            
            <div style={{ marginTop: 'var(--nb-space-6)' }}>
              {gameModes.map((mode, index) => (
                <div
                  key={mode.id}
                  className="nb-card nb-card-interactive"
                  style={{ marginBottom: 'var(--nb-space-4)' }}
                  onClick={() => handleCardPress(mode.id)}
                >
                  <div style={{ padding: 'var(--nb-space-4)', display: 'flex', alignItems: 'center', gap: 'var(--nb-space-4)' }}>
                    <div style={{ fontSize: 'var(--nb-text-2xl)' }}>{mode.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div className="nb-text" style={{ fontWeight: '700', fontSize: 'var(--nb-text-lg)' }}>{mode.name}</div>
                      <div className="nb-text" style={{ fontSize: 'var(--nb-text-sm)' }}>{mode.description}</div>
                    </div>
                    <div style={{ fontSize: 'var(--nb-text-xl)' }}>▶️</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Neo-Brutalist Navigation */}
      <div className="nb-nav-section">
        <div className="nb-nav-buttons">
          <button 
            className="nb-nav-button active"
            onClick={() => handleNavigation('home')}
          >
            <div className="nb-nav-icon">
              <Home size={24} />
            </div>
            <span className="nb-nav-label">Home</span>
          </button>
          <button 
            className="nb-nav-button"
            onClick={() => handleNavigation('performance')}
          >
            <div className="nb-nav-icon">
              <BarChart3 size={24} />
            </div>
            <span className="nb-nav-label">Stats</span>
          </button>
          <button 
            className="nb-nav-button"
            onClick={() => handleNavigation('howtoplay')}
          >
            <div className="nb-nav-icon">
              <Target size={24} />
            </div>
            <span className="nb-nav-label">Rules</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;