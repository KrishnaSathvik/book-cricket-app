import React, { useState, useEffect } from 'react';
import { useGame } from '../../../store/GameContext';
import { 
  ArrowLeft, 
  Volume2,
  VolumeX,
  Home,
  BarChart3,
  Target
} from 'lucide-react';
import './GameScreen.css';

const GameScreen = () => {
  const { state, actions } = useGame();
  const [timeLeft, setTimeLeft] = useState(null);

  // Timer for Time Attack mode
  useEffect(() => {
    if (state.gameState.gameMode === 'timeAttack' && state.gameState.timeLimit && !state.gameState.isGameOver) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - state.gameState.startTime) / 1000);
        const remaining = Math.max(0, state.gameState.timeLimit - elapsed);
        setTimeLeft(remaining);
        
        if (remaining === 0) {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [state.gameState.gameMode, state.gameState.timeLimit, state.gameState.startTime, state.gameState.isGameOver]);

  const handleTurnPage = async () => {
    // Initialize audio on first user interaction
    actions.initializeAudio();
    
    actions.setAnimation(true);
    actions.turnPage();

    // Simulate page turning animation
    setTimeout(() => {
      actions.setAnimation(false);

      // Clear celebration after 3 seconds
      setTimeout(() => {
        actions.setCelebration(null);
      }, 3000);
    }, 800);
  };

  const handleGoHome = () => {
    actions.setCurrentScreen('home');
  };

  const handleNavigation = (screen) => {
    // Haptic feedback for navigation
    if (navigator.vibrate) {
      navigator.vibrate(50); // Short vibration
    }
    
    // Handle navigation to different screens
    actions.setCurrentScreen(screen);
  };

  const getGameModeInfo = () => {
    const modes = {
      single: { name: 'Quick Play' },
      tournament: { name: 'Tournament' },
      multiplayer: { name: 'Multiplayer' },
      timeAttack: { name: 'Time Attack' }
    };
    return modes[state.gameState.gameMode] || modes.single;
  };

  const gameModeInfo = getGameModeInfo();

  return (
    <div className="game-screen game-content">
      {/* Header */}
      <div className="game-header">
        <button className="back-btn touch-feedback" onClick={handleGoHome}>
          <ArrowLeft size={20} />
        </button>
        <div className="header-actions">
          <button 
            className="sound-btn touch-feedback" 
            onClick={() => {
              actions.initializeAudio();
              actions.toggleAudio();
            }}
            title={state.audioEnabled ? "Sound On" : "Sound Off"}
          >
            {state.audioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>
      </div>

      {/* Main Game Content */}
      <div className="game-content nb-container">
        {/* Main Game Header */}
        <div className="nb-card">
          <div style={{ padding: 'var(--nb-space-6)' }}>
            <h1 className="nb-title">🏏 {gameModeInfo.name}</h1>
            <div className="nb-subtitle">Live Cricket Match • Difficulty: {state.gameState.difficulty}</div>
          </div>
        </div>

        {/* Live Scoreboard */}
        <div className="nb-card">
          <div style={{ padding: 'var(--nb-space-6)' }}>
            <h2 className="nb-heading">📊 LIVE SCORE</h2>
            <div className="nb-subtitle">Current Innings</div>
            
            <div className="nb-score">
              <div className="nb-score-main">{state.gameState.score}/{state.gameState.wickets}</div>
              <div className="nb-score-details">RUNS / WICKETS</div>
            </div>
            
            <div className="nb-stats">
              <div className="nb-stat">
                <div className="nb-stat-value">{state.gameState.ballsFaced}</div>
                <div className="nb-stat-label">Balls Faced</div>
              </div>
              <div className="nb-stat">
                <div className="nb-stat-value">{Math.round((state.gameState.score / state.gameState.ballsFaced) * 100) || 0}%</div>
                <div className="nb-stat-label">Strike Rate</div>
              </div>
              {state.gameState.targetScore && (
                <div className="nb-stat">
                  <div className="nb-stat-value">{state.gameState.targetScore}</div>
                  <div className="nb-stat-label">Target</div>
                </div>
              )}
              {state.gameState.maxBalls && (
                <div className="nb-stat">
                  <div className="nb-stat-value">{Math.max(0, state.gameState.maxBalls - state.gameState.ballsFaced)}</div>
                  <div className="nb-stat-label">Balls Left</div>
                </div>
              )}
              {state.gameState.timeLimit && (
                <div className="nb-stat">
                  <div className="nb-stat-value">{timeLeft !== null ? timeLeft : Math.max(0, state.gameState.timeLimit - Math.floor((Date.now() - state.gameState.startTime) / 1000))}s</div>
                  <div className="nb-stat-label">Time Left</div>
                </div>
              )}
            </div>
          </div>
        </div>


        {/* Celebration Message */}
        {state.celebration && (
          <div className="nb-celebration">
            {state.celebration}
          </div>
        )}

        {/* Turn Page Button */}
        <div className="nb-card">
          <div style={{ padding: 'var(--nb-space-6)', textAlign: 'center' }}>
            <button
              className="nb-btn nb-btn-primary nb-btn-xl nb-btn-full"
              onClick={handleTurnPage}
              disabled={state.gameState.isGameOver || state.isAnimating}
            >
              {state.gameState.isGameOver ? '🏁 Game Over!' : 
               state.isAnimating ? '📖 Turning...' : '📖 Turn Page'}
            </button>
          </div>
        </div>

        {/* Recent Runs - Neo-Brutalist Style */}
        {state.gameState.runs.length > 0 && (
          <div className="nb-card">
            <div style={{ padding: 'var(--nb-space-6)' }}>
              <h2 className="nb-heading">📈 RECENT PERFORMANCE</h2>
              <div className="nb-subtitle">Last 12 balls</div>
              
              <div className="nb-runs">
                {state.gameState.runs.slice(-12).map((run, index) => (
                  <div
                    key={index}
                    className={`nb-run ${
                      run.isOut ? 'out' : 
                      run.runs === 6 ? 'six' : 
                      run.runs === 5 ? 'five' :
                      run.runs === 4 ? 'four' : 
                      run.runs === 3 ? 'three' :
                      run.runs === 2 ? 'two' :
                      run.runs === 1 ? 'single' : 'dot'
                    }`}
                    title={`Page: ${run.page}, ${run.isOut ? 'OUT' : run.runs === 0 ? 'Dot Ball' : run.runs + ' runs'}`}
                  >
                    {run.isOut ? 'OUT' : run.runs === 0 ? '•' : run.runs}
                  </div>
                ))}
              </div>
              
              <div className="nb-stats">
                <div className="nb-stat">
                  <div className="nb-stat-value">
                    {state.gameState.runs.filter(r => r.runs >= 4 && !r.isOut).length}
                  </div>
                  <div className="nb-stat-label">Boundaries</div>
                </div>
                <div className="nb-stat">
                  <div className="nb-stat-value">
                    {state.gameState.runs.filter(r => r.runs === 6 && !r.isOut).length}
                  </div>
                  <div className="nb-stat-label">Sixes</div>
                </div>
                <div className="nb-stat">
                  <div className="nb-stat-value">
                    {state.gameState.runs.filter(r => r.runs === 0 && !r.isOut).length}
                  </div>
                  <div className="nb-stat-label">Dot Balls</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Game Over Modal */}
      {state.gameState.isGameOver && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 'var(--nb-space-6)'
        }}>
          <div className="nb-card" style={{ maxWidth: '400px', width: '100%' }}>
            <div style={{ padding: 'var(--nb-space-8)', textAlign: 'center' }}>
              <h2 className="nb-title">🏏 Game Over! 🏏</h2>
              <div className="nb-text" style={{ margin: 'var(--nb-space-4) 0' }}>
                {state.gameState.gameOverReason}
              </div>
              <div className="nb-score">
                <div className="nb-score-main">{state.gameState.score}</div>
                <div className="nb-score-details">Final Score</div>
              </div>
              <div className="nb-text" style={{ margin: 'var(--nb-space-4) 0' }}>
                {state.gameState.wickets} wickets • {state.gameState.ballsFaced} balls
              </div>
                
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nb-space-4)', marginTop: 'var(--nb-space-6)' }}>
                <button
                  className="nb-btn nb-btn-primary nb-btn-lg nb-btn-full"
                  onClick={() => actions.startNewGame({
                    mode: state.gameState.gameMode,
                    difficulty: state.gameState.difficulty
                  })}
                >
                  Play Again
                </button>
                <button
                  className="nb-btn nb-btn-secondary nb-btn-lg nb-btn-full"
                  onClick={handleGoHome}
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Neo-Brutalist Navigation */}
      <div className="nb-nav-section">
        <div className="nb-nav-buttons">
          <button 
            className="nb-nav-button"
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

export default GameScreen;