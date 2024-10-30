import React, { useState, useEffect } from 'react';
import { Crown, MessageCircle } from 'lucide-react';
import type { AIPlayer, Answer, Vote, VoteHistory, GamePhase } from '../types/game';
import prompts from '../data/prompts';
import { generateAIResponse, generateAIVotes } from '../utils/ai';
import { Timer } from './Timer';
import { AnswerForm } from './AnswerForm';
import { PlayerAvatar } from './PlayerAvatar';

interface GameProps {
  players: string[];
  aiPlayers: AIPlayer[];
}

export const Game: React.FC<GameProps> = ({ players, aiPlayers }) => {
  const [currentRound, setCurrentRound] = useState(1);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [gamePhase, setGamePhase] = useState<GamePhase>('answer');
  const [timeLeft, setTimeLeft] = useState(10);
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries([...players, ...aiPlayers.map(ai => ai.name)].map(p => [p, 0]))
  );
  const [voteHistory, setVoteHistory] = useState<VoteHistory[]>([]);
  const [currentVotes, setCurrentVotes] = useState<Vote[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Answer[]>([]);
  const [roundPlayers] = useState(() => 
    [...players, ...aiPlayers.map(ai => ai.name)]
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)
  );
  const [waitingForPlayer, setWaitingForPlayer] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);

  useEffect(() => {
    setCurrentPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
  }, [currentRound]);

  useEffect(() => {
    if (timeLeft > 0 && !timerPaused) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      if (gamePhase === 'answer') {
        handlePhaseTransition();
      } else if (gamePhase === 'vote') {
        setGamePhase('results');
      }
    }
  }, [timeLeft, gamePhase, timerPaused]);

  useEffect(() => {
    const processAnswers = async () => {
      if (gamePhase === 'answer' && answers.length < roundPlayers.length) {
        const currentPlayer = roundPlayers[answers.length];
        const isAIPlayer = aiPlayers.find(ai => ai.name === currentPlayer);

        if (isAIPlayer) {
          setTimerPaused(false);
          await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
          handleSubmitAnswer(generateAIResponse(currentPrompt));
        } else {
          setTimerPaused(true);
          setWaitingForPlayer(true);
        }
      }
    };

    processAnswers();
  }, [answers, gamePhase, roundPlayers, currentPrompt, aiPlayers]);

  const handlePhaseTransition = async () => {
    setGamePhase('vote');
    setTimeLeft(10);
    setTimerPaused(false);
    setSelectedAnswers(answers);

    if (aiPlayers.length > 0) {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
      const { votes, voteDetails } = generateAIVotes(
        answers,
        aiPlayers.map(ai => ai.name).filter(name => !roundPlayers.includes(name))
      );
      
      votes.forEach((voteCount, votedPlayer) => {
        setAnswers(prev => 
          prev.map(ans => 
            ans.player === votedPlayer 
              ? { ...ans, votes: ans.votes + voteCount }
              : ans
          )
        );
      });

      setCurrentVotes(voteDetails);
    }
  };

  const handleSubmitAnswer = (answer: string) => {
    const playerIndex = answers.length;
    if (playerIndex < roundPlayers.length) {
      setAnswers(prev => [...prev, {
        player: roundPlayers[playerIndex],
        text: answer,
        votes: 0
      }]);
      setWaitingForPlayer(false);
      setTimerPaused(false);
    }
  };

  const handleVote = (answerIndex: number) => {
    const currentPlayer = players[0];
    const targetAnswer = answers[answerIndex];
    
    if (targetAnswer.player !== currentPlayer) {
      setAnswers(prev => prev.map((ans, idx) => 
        idx === answerIndex ? { ...ans, votes: ans.votes + 1 } : ans
      ));
      setCurrentVotes(prev => [...prev, {
        voter: currentPlayer,
        votedFor: targetAnswer.player,
        comment: "Your vote has been cast!"
      }]);
    }
  };

  const getAIAvatar = (playerName: string) => {
    return aiPlayers.find(ai => ai.name === playerName)?.avatar;
  };

  const nextRound = () => {
    setVoteHistory(prev => [...prev, {
      round: currentRound,
      votes: currentVotes
    }]);
    
    const roundScores = answers.reduce((acc, ans) => ({
      ...acc,
      [ans.player]: (acc[ans.player] || 0) + ans.votes * 100
    }), {...scores});
    
    setScores(roundScores);
    setAnswers([]);
    setCurrentVotes([]);
    setCurrentRound(prev => prev + 1);
    setGamePhase('answer');
    setTimeLeft(10);
    setTimerPaused(false);
    setWaitingForPlayer(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Round {currentRound}/3</h2>
        <Timer timeLeft={timeLeft} />
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">{currentPrompt}</h3>
        
        {gamePhase === 'answer' && answers.length < roundPlayers.length && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <PlayerAvatar
                player={roundPlayers[answers.length]}
                avatar={getAIAvatar(roundPlayers[answers.length])}
                isAI={!!aiPlayers.find(ai => ai.name === roundPlayers[answers.length])}
              />
              {waitingForPlayer && (
                <span className="text-blue-500 animate-pulse">Waiting for your answer...</span>
              )}
            </div>
            {waitingForPlayer && (
              <AnswerForm onSubmit={handleSubmitAnswer} />
            )}
          </div>
        )}

        {gamePhase === 'vote' && (
          <div className="space-y-4">
            <p className="text-gray-600 mb-4">Vote for your favorite answer!</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {selectedAnswers.map((answer, idx) => (
                <button
                  key={idx}
                  onClick={() => handleVote(idx)}
                  disabled={answer.player === players[0]}
                  className={`p-4 text-left rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors ${
                    answer.player === players[0] ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{answer.text}</span>
                    <PlayerAvatar
                      player={answer.player}
                      avatar={getAIAvatar(answer.player)}
                      isAI={!!aiPlayers.find(ai => ai.name === answer.player)}
                      size="sm"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {gamePhase === 'results' && (
          <div className="space-y-6">
            <div className="space-y-4">
              {selectedAnswers
                .sort((a, b) => b.votes - a.votes)
                .map((answer, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <PlayerAvatar
                        player={answer.player}
                        avatar={getAIAvatar(answer.player)}
                        isAI={!!aiPlayers.find(ai => ai.name === answer.player)}
                      />
                      <div className="flex items-center space-x-2">
                        {idx === 0 && <Crown className="w-5 h-5 text-yellow-500" />}
                        <span className="font-bold text-gray-700">{answer.votes} votes</span>
                      </div>
                    </div>
                    <p className="text-gray-800 mt-2">{answer.text}</p>
                    <div className="mt-4 space-y-2">
                      <div className="text-sm text-gray-500">
                        <p className="font-medium mb-1">Voted by:</p>
                        {currentVotes
                          .filter(vote => vote.votedFor === answer.player)
                          .map((vote, voteIdx) => (
                            <div key={voteIdx} className="flex items-center space-x-2 mb-1">
                              <PlayerAvatar
                                player={vote.voter}
                                avatar={getAIAvatar(vote.voter)}
                                isAI={!!aiPlayers.find(ai => ai.name === vote.voter)}
                                size="sm"
                              />
                              <MessageCircle className="w-3 h-3 text-blue-500" />
                              <span className="text-gray-600 italic">"{vote.comment}"</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            
            {currentRound < 3 ? (
              <button
                onClick={nextRound}
                className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Next Round
              </button>
            ) : (
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Game Over!</h3>
                <div className="space-y-2">
                  {Object.entries(scores)
                    .sort(([,a], [,b]) => b - a)
                    .map(([player, score], idx) => (
                      <div key={player} className="flex items-center justify-between p-2">
                        <PlayerAvatar
                          player={player}
                          avatar={getAIAvatar(player)}
                          isAI={!!aiPlayers.find(ai => ai.name === player)}
                        />
                        <span className="font-bold">{score} points</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};