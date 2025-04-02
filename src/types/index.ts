export interface Argument {
  id: string;
  date: string;
  category: string;
  severity: 1 | 2 | 3; // 1: Minor, 2: Moderate, 3: Severe
  status: 'ongoing' | 'resolved';
  resolution?: string;
  reflection?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  type: 'reward' | 'punishment';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  completed: boolean;
}