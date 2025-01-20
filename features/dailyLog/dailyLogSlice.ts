import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DailyLogEntry, Tag } from '@/types';

interface DailyLogState {
  logs: DailyLogEntry[];
  tags: Tag[];
  isLoading: boolean;
  error: string | null;
}

const initialState: DailyLogState = {
  logs: [],
  tags: [],
  isLoading: false,
  error: null,
};

const dailyLogSlice = createSlice({
  name: 'dailyLog',
  initialState,
  reducers: {
    setLogs: (state, action: PayloadAction<DailyLogEntry[]>) => {
      state.logs = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addLog: (state, action: PayloadAction<DailyLogEntry>) => {
      state.logs.unshift(action.payload);
    },
    setTags: (state, action: PayloadAction<Tag[]>) => {
      state.tags = action.payload;
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

export const { setLogs, addLog, setTags, setLoading, setError } =
  dailyLogSlice.actions;
export default dailyLogSlice.reducer;
