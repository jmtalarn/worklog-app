import { dbPromise } from './db';
import type { Client } from './types';

export async function addClient(client: Client) {
	const db = await dbPromise;
	client.id = client.id || crypto.randomUUID(); // Ensure id is set
	await db.add('clients', client);
	return client.id;
}

export async function getAllClients(): Promise<Client[]> {
	const db = await dbPromise;
	return db.getAll('clients');
}

export async function getClientById(id: string): Promise<Client | undefined> {
	const db = await dbPromise;
	return db.get('clients', id);
}

export async function deleteClient(id: string) {
	const db = await dbPromise;
	await db.delete('clients', id);
}
