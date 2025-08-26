import { createSlice } from '@reduxjs/toolkit';

interface SettingsState {
	darkMode: boolean;
}

const storageKey = 'darkModePreference';

// Get initial value from localStorage
const storedValue = localStorage.getItem(storageKey);
const initialState: SettingsState = {
	darkMode: storedValue ? JSON.parse(storedValue) : false,
};


const settingsSlice = createSlice({
	name: 'ui',
	initialState,
	reducers: {
		setDarkMode(state, action) {
			state.darkMode = action.payload;
			document.documentElement.classList.toggle('dark');
			localStorage.setItem(storageKey, JSON.stringify(action.payload));
		},
		loadSettings(state) {
			const stored = localStorage.getItem(storageKey);
			if (stored !== null) {
				state.darkMode = JSON.parse(stored);
				document.documentElement.classList.toggle('dark', state.darkMode);
			}
		}
	},
});

export const {
	setDarkMode,
	loadSettings
} = settingsSlice.actions;
export default settingsSlice.reducer;
