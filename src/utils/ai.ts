import type { AIPlayer, Vote } from '../types/game';

const aiResponses = [
  "That's hilarious! You got my vote!",
  "Not bad, but I've heard better...",
  "This answer speaks to my robot soul.",
  "Absolutely brilliant! *beep boop*",
  "My algorithms are impressed!",
];

export const generateAIResponse = (prompt: string): string => {
  // Simple AI response generation based on the prompt
  const responses = [
    `Well, ${prompt.toLowerCase().replace('?', '')} is obviously about ${Math.random() > 0.5 ? 'robots' : 'algorithms'}!`,
    `As an AI, I think ${prompt.toLowerCase().replace('?', '')} deserves a creative response!`,
    `Let me process this... ${prompt.toLowerCase().replace('?', '')} reminds me of binary code!`,
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

export const generateAIVotes = (
  answers: { player: string; text: string }[],
  voters: string[]
): { votes: Map<string, number>; voteDetails: Vote[] } => {
  const votes = new Map<string, number>();
  const voteDetails: Vote[] = [];

  voters.forEach(voter => {
    const validAnswers = answers.filter(a => a.player !== voter);
    if (validAnswers.length > 0) {
      const votedAnswer = validAnswers[Math.floor(Math.random() * validAnswers.length)];
      votes.set(
        votedAnswer.player,
        (votes.get(votedAnswer.player) || 0) + 1
      );
      voteDetails.push({
        voter,
        votedFor: votedAnswer.player,
        comment: aiResponses[Math.floor(Math.random() * aiResponses.length)],
      });
    }
  });

  return { votes, voteDetails };
};