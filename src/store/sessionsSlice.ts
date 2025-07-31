import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addSession, updateSession, getAllSessions } from '@/lib/db/sessionStore';
import type { Session } from '@/lib/db/types';

export const loadSessions = createAsyncThunk('sessions/load', async () => {
	return await getAllSessions();
});

export const startSession = createAsyncThunk('sessions/start', async (projectId: string) => {
	const start = new Date().toISOString();
	const id = await addSession({ start, projectId });
	return { id: String(id), start, projectId };
});

export const stopSession = createAsyncThunk('sessions/stop', async (sessionId: string) => {
	const end = new Date().toISOString();
	await updateSession(sessionId, { end });
	return { sessionId, end };
});

interface SessionsState {
	sessions: Session[];
	currentSessionId: string | null;
}

const initialState: SessionsState = {
	sessions: [],
	currentSessionId: null,
};

const sessionsSlice = createSlice({
	name: 'sessions',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(loadSessions.fulfilled, (state, action) => {
				state.sessions = action.payload;
				const active = action.payload.find((s) => !s.end);
				state.currentSessionId = active?.id ?? null;
			})
			.addCase(startSession.fulfilled, (state, action) => {
				const session = action.payload;
				state.sessions.push(session);
				state.currentSessionId = session.id;
			})
			.addCase(stopSession.fulfilled, (state, action) => {
				const session = state.sessions.find(s => s.id === action.payload.sessionId);
				if (session) session.end = action.payload.end;
				state.currentSessionId = null;
			});
	},
});

export default sessionsSlice.reducer;
