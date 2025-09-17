import React from 'react';
import { useGame } from '../../../store/GameContext';
import { 
  ArrowLeft,
  BookOpen,
  Target,
  Trophy
} from 'lucide-react';
import './HowToPlayScreen.css';

const HowToPlayScreen = () => {
  const { actions } = useGame();

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

  const rules = [
    {
      icon: '📄',
      title: 'Open a Random Page',
      description: 'Open any page in your book to start playing'
    },
    {
      icon: '🏃',
      title: 'Pages 1, 2, 3',
      description: 'These pages give you 1, 2, or 3 runs (singles, doubles, triples)'
    },
    {
      icon: '🏏',
      title: 'Page 4 & 6',
      description: 'Page 4 = 4 runs (boundary), Page 6 = 6 runs (six)'
    },
    {
      icon: '⚪',
      title: 'Pages 7, 8, 9',
      description: 'These pages give you 0 runs (dot ball)'
    },
    {
      icon: '❌',
      title: 'Pages Ending in 0',
      description: 'Any page ending in 0 means you are OUT!'
    },
    {
      icon: '🎯',
      title: 'Score Maximum Runs',
      description: 'Try to score as many runs as possible before getting out'
    }
  ];

  const gameModes = [
    {
      icon: <BookOpen size={20} />,
      name: 'Quick Play',
      description: '25 balls • Score maximum runs',
      color: '#007aff'
    },
    {
      icon: <Trophy size={20} />,
      name: 'Tournament',
      description: '50 balls • Target: 100 runs',
      color: '#ff9500'
    },
    {
      icon: <Target size={20} />,
      name: 'Time Attack',
      description: '2 minutes • Score as much as possible',
      color: '#ff3b30'
    }
  ];

  return (
    <div className="how-to-play-screen how-to-play-content">
      {/* Header */}
      <div className="how-to-play-header">
        <button className="back-btn touch-feedback" onClick={handleGoHome}>
          <ArrowLeft size={20} />
        </button>
        <div className="header-spacer"></div>
      </div>

      {/* Main Content */}
      <div className="how-to-play-content nb-container">
        {/* Main Rules Header */}
        <div className="nb-card">
          <div style={{ padding: 'var(--nb-space-8)', textAlign: 'center' }}>
            <h1 className="nb-title">📖 How to Play</h1>
            <div className="nb-subtitle">Learn the rules and master Book Cricket</div>
          </div>
        </div>

        {/* Neo-Brutalist Game Rules Section */}
        <div className="nb-card">
          <div style={{ padding: 'var(--nb-space-6)' }}>
            <h2 className="nb-heading">🏏 Game Rules</h2>
            <div className="nb-subtitle">Understanding the scoring system</div>
            
            <div style={{ marginTop: 'var(--nb-space-6)' }}>
              {rules.map((rule, index) => (
                <div key={index} className="nb-card" style={{ marginBottom: 'var(--nb-space-4)' }}>
                  <div style={{ padding: 'var(--nb-space-4)', display: 'flex', alignItems: 'center', gap: 'var(--nb-space-4)' }}>
                    <div style={{ fontSize: 'var(--nb-text-2xl)' }}>{rule.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div className="nb-text" style={{ fontWeight: '700', fontSize: 'var(--nb-text-lg)' }}>{rule.title}</div>
                      <div className="nb-text" style={{ fontSize: 'var(--nb-text-sm)' }}>{rule.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Neo-Brutalist Game Modes Section */}
        <div className="nb-card">
          <div style={{ padding: 'var(--nb-space-6)' }}>
            <h2 className="nb-heading">🎮 Game Modes</h2>
            <div className="nb-subtitle">Choose your preferred playing style</div>
            
            <div style={{ marginTop: 'var(--nb-space-6)' }}>
              {gameModes.map((mode, index) => (
                <div key={index} className="nb-card" style={{ marginBottom: 'var(--nb-space-4)' }}>
                  <div style={{ padding: 'var(--nb-space-4)', display: 'flex', alignItems: 'center', gap: 'var(--nb-space-4)' }}>
                    <div style={{ fontSize: 'var(--nb-text-2xl)', color: mode.color }}>{mode.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div className="nb-text" style={{ fontWeight: '700', fontSize: 'var(--nb-text-lg)' }}>{mode.name}</div>
                      <div className="nb-text" style={{ fontSize: 'var(--nb-text-sm)' }}>{mode.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Neo-Brutalist Tips Section */}
        <div className="nb-card">
          <div style={{ padding: 'var(--nb-space-6)' }}>
            <h2 className="nb-heading">💡 Pro Tips</h2>
            <div className="nb-subtitle">Master the game with these strategies</div>
            
            <div style={{ marginTop: 'var(--nb-space-6)' }}>
              <div className="nb-card" style={{ marginBottom: 'var(--nb-space-4)' }}>
                <div style={{ padding: 'var(--nb-space-4)', display: 'flex', alignItems: 'center', gap: 'var(--nb-space-4)' }}>
                  <div style={{ fontSize: 'var(--nb-text-2xl)' }}>💡</div>
                  <div style={{ flex: 1 }}>
                    <div className="nb-text" style={{ fontWeight: '700', fontSize: 'var(--nb-text-lg)' }}>Strategy</div>
                    <div className="nb-text" style={{ fontSize: 'var(--nb-text-sm)' }}>Focus on getting boundaries (4s) and sixes (6s) for maximum runs</div>
                  </div>
                </div>
              </div>
              <div className="nb-card" style={{ marginBottom: 'var(--nb-space-4)' }}>
                <div style={{ padding: 'var(--nb-space-4)', display: 'flex', alignItems: 'center', gap: 'var(--nb-space-4)' }}>
                  <div style={{ fontSize: 'var(--nb-text-2xl)' }}>⚡</div>
                  <div style={{ flex: 1 }}>
                    <div className="nb-text" style={{ fontWeight: '700', fontSize: 'var(--nb-text-lg)' }}>Speed</div>
                    <div className="nb-text" style={{ fontSize: 'var(--nb-text-sm)' }}>Turn pages quickly in Time Attack mode to maximize your score</div>
                  </div>
                </div>
              </div>
              <div className="nb-card" style={{ marginBottom: 'var(--nb-space-4)' }}>
                <div style={{ padding: 'var(--nb-space-4)', display: 'flex', alignItems: 'center', gap: 'var(--nb-space-4)' }}>
                  <div style={{ fontSize: 'var(--nb-text-2xl)' }}>🎯</div>
                  <div style={{ flex: 1 }}>
                    <div className="nb-text" style={{ fontWeight: '700', fontSize: 'var(--nb-text-lg)' }}>Accuracy</div>
                    <div className="nb-text" style={{ fontSize: 'var(--nb-text-sm)' }}>Avoid pages ending in 0 - they will get you out!</div>
                  </div>
                </div>
              </div>
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
              <BookOpen size={24} />
            </div>
            <span className="nb-nav-label">Home</span>
          </button>
          <button 
            className="nb-nav-button"
            onClick={() => handleNavigation('performance')}
          >
            <div className="nb-nav-icon">
              <Trophy size={24} />
            </div>
            <span className="nb-nav-label">Stats</span>
          </button>
          <button 
            className="nb-nav-button active"
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

export default HowToPlayScreen;
