import { openDB } from 'idb';

const DB_NAME = 'worktracker';
const DB_VERSION = 1;

export const dbPromise = openDB(DB_NAME, DB_VERSION, {
	upgrade(db) {
		db.createObjectStore('clients', { keyPath: 'id' });
		const projectStore = db.createObjectStore('projects', { keyPath: 'id' });
		const sessionStore = db.createObjectStore('sessions', { keyPath: 'id' });

		// Índex opcional per buscar projectes per client
		projectStore.createIndex('by-client', 'clientId');
		sessionStore.createIndex('by-project', 'projectId');
	},
});
