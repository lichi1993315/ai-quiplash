export interface AIPlayer {
  name: string;
  avatar: string;
  personality: string;
}

export interface Answer {
  player: string;
  text: string;
  votes: number;
}

export interface Vote {
  voter: string;
  votedFor: string;
  comment: string;
}

export interface VoteHistory {
  round: number;
  votes: Vote[];
}

export type GamePhase = 'answer' | 'vote' | 'results';