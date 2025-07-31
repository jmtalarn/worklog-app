import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllProjects, addProject, deleteProject } from '@/lib/db/projectStore';
import type { Project } from '@/lib/db/types';

export const loadProjects = createAsyncThunk('projects/load', async () => {
	return await getAllProjects();
});

export const addProjectThunk = createAsyncThunk('projects/add', async (project: Project) => {
	const id = await addProject(project);
	return { ...project, id };
});

export const deleteProjectThunk = createAsyncThunk('projects/delete', async (id: string) => {
	await deleteProject(id);
	return id;
});

interface ProjectsState {
	list: Project[];
}

const initialState: ProjectsState = {
	list: [],
};

const projectsSlice = createSlice({
	name: 'projects',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(loadProjects.fulfilled, (state, action) => {
				state.list = action.payload;
			})
			.addCase(addProjectThunk.fulfilled, (state, action) => {
				state.list.push(action.payload);
			})
			.addCase(deleteProjectThunk.fulfilled, (state, action) => {
				state.list = state.list.filter(p => p.id !== action.payload);
			});
	},
});

export default projectsSlice.reducer;
