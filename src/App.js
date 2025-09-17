import React from 'react';
import { GameProvider, useGame } from './store/GameContext';
import HomeScreen from './components/screens/HomeScreen/HomeScreen';
import GameScreen from './components/screens/GameScreen/GameScreen';
import HowToPlayScreen from './components/screens/HowToPlayScreen/HowToPlayScreen';
import PerformanceScreen from './components/screens/PerformanceScreen/PerformanceScreen';
import DifficultyScreen from './components/screens/DifficultyScreen/DifficultyScreen';
import './styles/design-system.css';

// Main App Component
const AppContent = () => {
  const { state } = useGame();

  const renderCurrentScreen = () => {
    switch (state.currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'difficulty':
        return <DifficultyScreen />;
      case 'game':
        return <GameScreen />;
      case 'gameOver':
        return <GameScreen />; // GameScreen handles the game over state
      case 'howtoplay':
        return <HowToPlayScreen />;
      case 'performance':
        return <PerformanceScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="app">
      {renderCurrentScreen()}
    </div>
  );
};

// App with Provider
const App = () => {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
};

export default App;
