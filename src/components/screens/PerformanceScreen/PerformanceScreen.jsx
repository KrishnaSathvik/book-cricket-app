import React from 'react';
import { useGame } from '../../../store/GameContext';
import { 
  ArrowLeft,
  Trophy,
  Target,
  BarChart3
} from 'lucide-react';
import './PerformanceScreen.css';

const PerformanceScreen = () => {
  const { state, actions } = useGame();

  const handleNavigation = (screen) => {
    // Haptic feedback for navigation
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    actions.setCurrentScreen(screen);
  };

  const handleGoHome = () => {
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
    actions.setCurrentScreen('home');
  };


  const achievements = [
    {
      icon: '🏆',
      title: 'First Game',
      description: 'Play your first game',
      unlocked: state.achievements?.firstGame || false
    },
    {
      icon: '🎯',
      title: 'Century',
      description: 'Score 100+ runs in a single game',
      unlocked: state.achievements?.centurion || false
    },
    {
      icon: '⚡',
      title: 'Six Master',
      description: 'Hit 10+ sixes in total',
      unlocked: state.achievements?.sixMaster || false
    },
    {
      icon: '🔥',
      title: 'Boundary King',
      description: 'Hit 25+ boundaries in total',
      unlocked: state.achievements?.boundaryKing || false
    },
    {
      icon: '📈',
      title: 'Consistent',
      description: 'Play 10+ games',
      unlocked: state.achievements?.consistent || false
    },
    {
      icon: '🎖️',
      title: 'Pro Player',
      description: 'Achieve 80%+ strike rate',
      unlocked: state.achievements?.proPlayer || false
    }
  ];

  return (
    <div className="performance-screen performance-content">
      {/* Header */}
      <div className="performance-header">
        <button className="back-btn touch-feedback" onClick={handleGoHome}>
          <ArrowLeft size={20} />
        </button>
        <div className="header-spacer"></div>
      </div>

      {/* Main Content */}
      <div className="performance-content nb-container">
        {/* Main Performance Header */}
        <div className="nb-card">
          <div style={{ padding: 'var(--nb-space-8)', textAlign: 'center' }}>
            <h1 className="nb-title">📊 Your Performance</h1>
            <div className="nb-subtitle">Track your cricket journey and achievements</div>
          </div>
        </div>

        {/* Neo-Brutalist Player Statistics */}
        <div className="nb-card">
          <div style={{ padding: 'var(--nb-space-6)' }}>
            <h2 className="nb-heading">🏏 Player Statistics</h2>
            <div className="nb-subtitle">Career Performance</div>
            
            <div className="nb-stats">
              <div className="nb-stat">
                <div className="nb-stat-value">{state.userStats?.totalGamesPlayed || 0}</div>
                <div className="nb-stat-label">Games Played</div>
              </div>
              <div className="nb-stat">
                <div className="nb-stat-value">{state.userStats?.totalRuns || 0}</div>
                <div className="nb-stat-label">Total Runs</div>
              </div>
              <div className="nb-stat">
                <div className="nb-stat-value">{state.userStats?.highestScore || 0}</div>
                <div className="nb-stat-label">Highest Score</div>
              </div>
              <div className="nb-stat">
                <div className="nb-stat-value">{state.userStats?.averageScore || 0}</div>
                <div className="nb-stat-label">Average Score</div>
              </div>
              <div className="nb-stat">
                <div className="nb-stat-value">{state.userStats?.strikeRate || 0}%</div>
                <div className="nb-stat-label">Strike Rate</div>
              </div>
              <div className="nb-stat">
                <div className="nb-stat-value">{state.userStats?.totalBallsFaced || 0}</div>
                <div className="nb-stat-label">Balls Faced</div>
              </div>
            </div>
          </div>
        </div>

        {/* Neo-Brutalist Boundaries & Sixes */}
        <div className="nb-card">
          <div style={{ padding: 'var(--nb-space-6)' }}>
            <h2 className="nb-heading">🎯 Boundaries & Sixes</h2>
            <div className="nb-subtitle">Power Hitting Stats</div>
            
            <div className="nb-stats">
              <div className="nb-stat">
                <div className="nb-stat-value">{state.userStats?.totalBoundaries || 0}</div>
                <div className="nb-stat-label">Boundaries (4s)</div>
              </div>
              <div className="nb-stat">
                <div className="nb-stat-value">{state.userStats?.totalSixes || 0}</div>
                <div className="nb-stat-label">Sixes (6s)</div>
              </div>
              <div className="nb-stat">
                <div className="nb-stat-value">{state.userStats?.totalDotBalls || 0}</div>
                <div className="nb-stat-label">Dot Balls</div>
              </div>
              <div className="nb-stat">
                <div className="nb-stat-value">{state.userStats?.totalWickets || 0}</div>
                <div className="nb-stat-label">Wickets Lost</div>
              </div>
              <div className="nb-stat">
                <div className="nb-stat-value">{state.userStats?.longestStreak || 0}</div>
                <div className="nb-stat-label">Longest Streak</div>
              </div>
              <div className="nb-stat">
                <div className="nb-stat-value">{state.userStats?.timePlayedMinutes || 0} min</div>
                <div className="nb-stat-label">Time Played</div>
              </div>
            </div>
          </div>
        </div>

        {/* Neo-Brutalist Achievements Section */}
        <div className="nb-card">
          <div style={{ padding: 'var(--nb-space-6)' }}>
            <h2 className="nb-heading">🏆 Achievements</h2>
            <div className="nb-subtitle">
              {state.userStats?.achievementsUnlocked || 0} / {achievements.length} Unlocked
            </div>
            
            <div style={{ marginTop: 'var(--nb-space-6)' }}>
              {achievements.map((achievement, index) => (
                <div 
                  key={index} 
                  className="nb-card"
                  style={{ 
                    marginBottom: 'var(--nb-space-4)',
                    borderColor: achievement.unlocked ? 'var(--nb-cricket-green)' : 'var(--nb-gray-400)',
                    borderWidth: achievement.unlocked ? '6px' : '4px'
                  }}
                >
                  <div style={{ padding: 'var(--nb-space-4)', display: 'flex', alignItems: 'center', gap: 'var(--nb-space-4)' }}>
                    <div style={{ fontSize: 'var(--nb-text-2xl)' }}>{achievement.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div className="nb-text" style={{ fontWeight: '700', fontSize: 'var(--nb-text-lg)' }}>{achievement.title}</div>
                      <div className="nb-text" style={{ fontSize: 'var(--nb-text-sm)' }}>{achievement.description}</div>
                    </div>
                    <div style={{ fontSize: 'var(--nb-text-xl)' }}>
                      {achievement.unlocked ? '✅' : '🔒'}
                    </div>
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
            className="nb-nav-button"
            onClick={() => handleNavigation('home')}
          >
            <div className="nb-nav-icon">
              <Trophy size={24} />
            </div>
            <span className="nb-nav-label">Home</span>
          </button>
          <button 
            className="nb-nav-button active"
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

export default PerformanceScreen;
