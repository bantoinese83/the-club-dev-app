export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  lastLogDate?: Date;
  streak: number;
}

export interface DailyLogEntry {
  id: string;
  content: string;
  createdAt: string;
  tags: Tag[];
}

export interface Tag {
  id: string;
  name: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  progress: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface GitHubStats {
  totalCommits: number;
  commitsThisWeek: number;
  publicRepos: number;
  followers: number;
  following: number;
  totalStars: number;
  totalForks: number;
}

export interface Commit {
  id: string;
  message: string;
  date: Date;
}

// Utility types
export type PartialUser = Partial<User>;
export type RequiredGoal = Required<Goal>;
export type ReadonlyDailyLogEntry = Readonly<DailyLogEntry>;
export type UserProfile = Pick<User, 'name' | 'email' | 'image'>;
export type DailyLogWithoutTags = Omit<DailyLogEntry, 'tags'>;
export type TagRecord = Record<string, Tag>;
