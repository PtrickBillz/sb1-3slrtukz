export interface User {
  id: string;
  name: string;
  email: string;
  xp: number;
  level: number;
  avatar?: string;
  wallets: string[];
  joinedAt: Date;
}

export interface Task {
  id: string;
  project: string;
  title: string;
  description: string;
  reward: number;
  deadline: Date;
  status: 'available' | 'accepted' | 'completed' | 'pending';
  type: 'shill' | 'engagement' | 'analysis';
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface WalletData {
  address: string;
  balance: number;
  tokens: TokenData[];
  riskScore: number;
  totalValue: number;
}

export interface TokenData {
  symbol: string;
  name: string;
  price: number;
  balance: number;
  marketCap: number;
  riskScore: number;
}

export interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  isUser: boolean;
}