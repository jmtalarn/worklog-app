import { dbPromise } from './db';
import type { Session } from './types';

export async function addSession(session: Session) {
	const db = await dbPromise;
	session.id = session.id || crypto.randomUUID(); // Ensure id is set
	db.add('sessions', session);
	return session.id;
}

export async function updateSession(id: string, data: Partial<Session>) {
	const db = await dbPromise;
	const session = await db.get('sessions', id);
	if (session) {
		const updated = { ...session, ...data };
		await db.put('sessions', updated);
	}
}

export async function getAllSessions(): Promise<Session[]> {
	const db = await dbPromise;
	return db.getAll('sessions');
}


export async function deleteSession(id: string) {
	const db = await dbPromise;
	await db.delete('sessions', id);
}
