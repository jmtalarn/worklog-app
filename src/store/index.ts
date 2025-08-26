import { configureStore } from '@reduxjs/toolkit';
import clientsReducer from '@/store/clientsSlice';
import projectsReducer from '@/store/projectsSlice';
import sessionsReducer from '@/store/sessionsSlice';
import uiReducer from '@/store/uiSlice';
import settingsReducer from '@/store/settingsSlice';

export const store = configureStore({
	reducer: {
		clients: clientsReducer,
		projects: projectsReducer,
		sessions: sessionsReducer,
		settings: settingsReducer,
		ui: uiReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
