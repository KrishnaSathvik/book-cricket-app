import React from 'react';
import { useGame } from '../../../store/GameContext';
import { 
  ArrowLeft,
  Target,
  Zap,
  Shield
} from 'lucide-react';
import './DifficultyScreen.css';

const DifficultyScreen = () => {
  const { state, actions } = useGame();

  const handleGoBack = () => {
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
    actions.setCurrentScreen('home');
  };

  const handleDifficultySelect = (difficulty) => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    actions.setSelectedDifficulty(difficulty);
    actions.startNewGame({
      mode: state.selectedMode,
      difficulty: difficulty,
      startTime: Date.now()
    });
    actions.setCurrentScreen('game');
  };

  const handleNavigation = (screen) => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    actions.setCurrentScreen(screen);
  };

  const difficulties = [
    {
      id: 'easy',
      name: 'Easy',
      description: 'Perfect for beginners and casual play',
      icon: <Shield size={24} />,
      color: '#34c759',
      features: ['Only page 0 = OUT', 'Score runs: 1,2,3,4,6', 'Safe: 5,7,8,9']
    },
    {
      id: 'medium',
      name: 'Medium',
      description: 'Standard Book Cricket experience',
      icon: <Target size={24} />,
      color: '#ff9500',
      features: ['Pages ending in 0 = OUT', 'Score runs: 1,2,3,4,6', 'Safe: 5,7,8,9']
    },
    {
      id: 'hard',
      name: 'Hard',
      description: 'For experienced players seeking challenge',
      icon: <Zap size={24} />,
      color: '#ff3b30',
      features: ['Pages ending in 0,5,7,8,9 = OUT', 'Score runs: 1,2,3,4,6', 'Very challenging!']
    }
  ];

  const getGameModeInfo = () => {
    const modes = {
      single: { name: 'Quick Play', description: '25 balls • Score maximum runs' },
      tournament: { name: 'Tournament', description: '50 balls • Target: 100 runs' },
      timeAttack: { name: 'Time Attack', description: '2 minutes • Score as much as possible' }
    };
    return modes[state.selectedMode] || modes.single;
  };

  const gameModeInfo = getGameModeInfo();

  return (
    <div className="difficulty-screen difficulty-content">
      {/* Header */}
      <div className="difficulty-header">
        <button className="back-btn touch-feedback" onClick={handleGoBack}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="screen-title">Choose Difficulty</h1>
        <div className="header-spacer"></div>
      </div>

      {/* Main Content */}
      <div className="difficulty-content">
        {/* Game Mode Info */}
        <div className="game-mode-info">
          <div className="mode-card card-enter stagger-1 touch-feedback">
            <div className="mode-icon">🎮</div>
            <div className="mode-content">
              <h2 className="mode-name">{gameModeInfo.name}</h2>
              <p className="mode-description">{gameModeInfo.description}</p>
            </div>
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="difficulty-section">
          <h2 className="section-title">Select Difficulty Level</h2>
          <div className="difficulties-grid">
            {difficulties.map((difficulty, index) => (
              <div
                key={difficulty.id}
                className={`difficulty-card card-enter stagger-${index + 1} touch-feedback`}
                onClick={() => handleDifficultySelect(difficulty.id)}
              >
                <div className="difficulty-icon" style={{ color: difficulty.color }}>
                  {difficulty.icon}
                </div>
                <div className="difficulty-content">
                  <h3 className="difficulty-name">{difficulty.name}</h3>
                  <p className="difficulty-description">{difficulty.description}</p>
                  <div className="difficulty-features">
                    {difficulty.features.map((feature, idx) => (
                      <span key={idx} className="feature-tag">{feature}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Neo-Brutalist Navigation */}
      <div className="nb-nav-section">
        <div className="nb-nav-buttons">
          <button 
            className="nb-nav-button"
            onClick={() => handleNavigation('home')}
          >
            <div className="nb-nav-icon">
              <Target size={24} />
            </div>
            <span className="nb-nav-label">Home</span>
          </button>
          <button 
            className="nb-nav-button"
            onClick={() => handleNavigation('performance')}
          >
            <div className="nb-nav-icon">
              <Target size={24} />
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

export default DifficultyScreen;
