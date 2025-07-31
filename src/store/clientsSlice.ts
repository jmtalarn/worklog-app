import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllClients, addClient, deleteClient } from '@/lib/db/clientStore';
import type { Client } from '@/lib/db/types';

export const loadClients = createAsyncThunk('clients/load', async () => {
	return await getAllClients();
});

export const addClientThunk = createAsyncThunk('clients/add', async (client: Client) => {
	const id = await addClient(client);
	return { ...client, id };
});

export const deleteClientThunk = createAsyncThunk('clients/delete', async (id: string) => {
	await deleteClient(id);
	return id;
});

interface ClientsState {
	list: Client[];
}

const initialState: ClientsState = {
	list: [],
};

const clientsSlice = createSlice({
	name: 'clients',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(loadClients.fulfilled, (state, action) => {
				state.list = action.payload;
			})
			.addCase(addClientThunk.fulfilled, (state, action) => {
				state.list.push(action.payload);
			})
			.addCase(deleteClientThunk.fulfilled, (state, action) => {
				state.list = state.list.filter(c => c.id !== action.payload);
			});
	},
});

export default clientsSlice.reducer;
