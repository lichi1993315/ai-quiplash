import React from 'react';
import { Game } from './components/Game';
import type { AIPlayer } from './types/game';

const aiPlayers: AIPlayer[] = [
  {
    name: "RoboJester",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=RoboJester",
    personality: "Witty and sarcastic"
  },
  {
    name: "CircuitBreaker",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=CircuitBreaker",
    personality: "Analytical and precise"
  },
  {
    name: "ByteBrain",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=ByteBrain",
    personality: "Quirky and random"
  },
  {
    name: "DataDiva",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=DataDiva",
    personality: "Dramatic and expressive"
  }
];

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Game players={["Player 1"]} aiPlayers={aiPlayers} />
    </div>
  );
}

export default App;