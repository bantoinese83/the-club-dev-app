import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Commit, GitHubStats } from '@/types';

interface GitHubState {
  isConnected: boolean;
  commits: Commit[];
  stats: GitHubStats | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: GitHubState = {
  isConnected: false,
  commits: [],
  stats: null,
  isLoading: false,
  error: null,
};

const githubSlice = createSlice({
  name: 'github',
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    setCommits: (state, action: PayloadAction<Commit[]>) => {
      state.commits = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setStats: (state, action: PayloadAction<GitHubStats>) => {
      state.stats = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setConnected, setCommits, setStats, setLoading, setError } =
  githubSlice.actions;
export default githubSlice.reducer;
