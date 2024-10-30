import React, { useState } from 'react';
import { UserPlus, Play, Bot } from 'lucide-react';
import { getAIPlayers, AIPlayer } from '../utils/ai';

interface JoinRoomProps {
  onStartGame: (players: string[], aiPlayers: AIPlayer[]) => void;
}

const JoinRoom: React.FC<JoinRoomProps> = ({ onStartGame }) => {
  const [players, setPlayers] = useState<string[]>([]);
  const [newPlayer, setNewPlayer] = useState('');

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlayer.trim() && players.length < 8) {
      setPlayers([...players, newPlayer.trim()]);
      setNewPlayer('');
    }
  };

  const handleStartGame = () => {
    const aiCount = Math.max(2, 8 - players.length);
    const aiPlayers = getAIPlayers(aiCount);
    onStartGame(players, aiPlayers);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Quipster!</h1>
          <p className="text-gray-600">Play solo or add up to 8 players</p>
          <p className="text-sm text-gray-500 mt-2">AI players will fill empty spots</p>
        </div>

        <form onSubmit={handleAddPlayer} className="mb-6">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newPlayer}
              onChange={(e) => setNewPlayer(e.target.value)}
              placeholder="Enter player name"
              className="flex-1 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={20}
            />
            <button
              type="submit"
              disabled={players.length >= 8}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </form>

        <div className="space-y-2 mb-6">
          {players.map((player, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <span className="font-medium text-gray-700">{player}</span>
              <button
                onClick={() => setPlayers(players.filter((_, i) => i !== index))}
                className="text-red-500 hover:text-red-600"
              >
                ×
              </button>
            </div>
          ))}
          {players.length < 8 && (
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-blue-500" />
                <span className="text-blue-600">
                  {Math.max(2, 8 - players.length)} AI players will join
                </span>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleStartGame}
          className="w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
        >
          <Play className="w-4 h-4" />
          <span>Start Game</span>
        </button>
      </div>
    </div>
  );
}

export default JoinRoom;