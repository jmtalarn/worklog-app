import { configureStore } from '@reduxjs/toolkit';
import clientsReducer from '@/store/clientsSlice';
import projectsReducer from '@/store/projectsSlice';
import sessionsReducer from '@/store/sessionsSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
	reducer: {
		clients: clientsReducer,
		projects: projectsReducer,
		sessions: sessionsReducer,
		ui: uiReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
