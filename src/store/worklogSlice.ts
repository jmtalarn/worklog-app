// store/worklogSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface WorklogState {
	activeProjectId: string | null;
	activeClientId: string | null;
	currentSessionId: string | null;
}

const initialState: WorklogState = {
	activeProjectId: null,
	activeClientId: null,
	currentSessionId: null,
};

const worklogSlice = createSlice({
	name: 'worklog',
	initialState,
	reducers: {
		setActiveClient(state, action: PayloadAction<string | null>) {
			state.activeClientId = action.payload;
			state.activeProjectId = null; // reset project when client changes
		},
		setActiveProject(state, action: PayloadAction<string | null>) {
			state.activeProjectId = action.payload;
		},
		setCurrentSession(state, action: PayloadAction<string | null>) {
			state.currentSessionId = action.payload;
		},
		resetWorklog(state) {
			state.activeProjectId = null;
			state.activeClientId = null;
			state.currentSessionId = null;
		},
	},
});

export const {
	setActiveClient,
	setActiveProject,
	setCurrentSession,
	resetWorklog,
} = worklogSlice.actions;

export default worklogSlice.reducer;
