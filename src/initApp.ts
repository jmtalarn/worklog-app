import { store } from './store';
import { loadClients } from './store/clientsSlice';
import { loadProjects } from './store/projectsSlice';
import { loadSessions } from './store/sessionsSlice';

/**
 * Inicialitza l'estat global carregant dades des de IndexedDB.
 */
export async function initApp() {
	await Promise.all([
		store.dispatch(loadClients()),
		store.dispatch(loadProjects()),
		store.dispatch(loadSessions()),
	]);
}
