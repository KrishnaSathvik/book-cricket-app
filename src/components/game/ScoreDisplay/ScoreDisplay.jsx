import React from 'react';
import './ScoreDisplay.css';

const ScoreDisplay = ({
  score,
  wickets,
  ballsFaced,
  targetScore,
  isGameOver = false,
  className = '',
  ...props
}) => {
  const strikeRate = ballsFaced > 0 ? Math.round((score / ballsFaced) * 100) : 0;
  const runsNeeded = targetScore ? Math.max(0, targetScore - score) : null;

  return (
    <div className={`score-display ${className}`} {...props}>
      {/* Main Score Card */}
      <div className="score-main">
        <div className="score-primary">
          <div className="score-number">{score}</div>
          <div className="score-label">Runs</div>
        </div>
        
        <div className="score-divider">/</div>
        
        <div className="score-secondary">
          <div className="score-number">{wickets}</div>
          <div className="score-label">Wickets</div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="score-stats">
        <div className="stat-item">
          <div className="stat-value">{ballsFaced}</div>
          <div className="stat-label">Balls</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value">{strikeRate}%</div>
          <div className="stat-label">SR</div>
        </div>
        
        {targetScore && (
          <div className="stat-item">
            <div className="stat-value">{runsNeeded}</div>
            <div className="stat-label">Need</div>
          </div>
        )}
      </div>

      {/* Game Status */}
      {isGameOver && (
        <div className="game-status">
          <div className="status-text">Game Over</div>
        </div>
      )}
    </div>
  );
};

export default ScoreDisplay;
