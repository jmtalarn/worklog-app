import { dbPromise } from './db';
import type { Project } from './types';

export async function addProject(project: Project): Promise<string> {
	const db = await dbPromise;
	project.id = project.id || crypto.randomUUID(); // Ensure id is set
	const key = await db.add('projects', project);
	return String(key);
}

export async function getAllProjects(): Promise<Project[]> {
	const db = await dbPromise;
	return db.getAll('projects');
}

export async function getProjectsByClient(clientId: string): Promise<Project[]> {
	const db = await dbPromise;
	const tx = db.transaction('projects');
	const store = tx.store;
	const all = await store.getAll();

	return all.filter(p => p.clientId === clientId);
}

export async function deleteProject(projectId: string): Promise<void> {
	const db = await dbPromise;
	await db.delete('projects', projectId);
}

export async function updateProject(projectId: string, updates: Partial<Project>): Promise<void> {
	const db = await dbPromise;
	const existing = await db.get('projects', projectId);
	if (existing) {
		const updated = { ...existing, ...updates };
		await db.put('projects', updated);
	}
}

export async function getProjectById(projectId: string): Promise<Project | undefined> {
	const db = await dbPromise;
	return db.get('projects', projectId);
}
