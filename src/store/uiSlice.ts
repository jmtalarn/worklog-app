import { createSlice } from '@reduxjs/toolkit';

interface UIState {
	showSettingsModal: boolean;
	showHistoryModal: boolean;
}

const initialState: UIState = {
	showSettingsModal: false, showHistoryModal: false,
};

const uiSlice = createSlice({
	name: 'ui',
	initialState,
	reducers: {
		openSettingsModal(state) {
			state.showSettingsModal = true;
		},
		closeSettingsModal(state) {
			state.showSettingsModal = false;
		},
		openHistoryModal(state) {
			state.showHistoryModal = true;
		},
		closeHistoryModal(state) {
			state.showHistoryModal = false;
		},
	},
});

export const {
	openSettingsModal,
	closeSettingsModal,
	openHistoryModal,
	closeHistoryModal,
} = uiSlice.actions;
export default uiSlice.reducer;
