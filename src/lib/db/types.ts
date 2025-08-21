export interface Client {
	id?: string;
	name: string;
	isPersonal?: boolean;
}

export interface Project {
	id?: string;
	name: string;
	clientId: string;
	isActive?: boolean;
}

export interface Session {
	id?: string;
	projectId: string;
	start: string;
	end?: string;
}

export interface SessionWithDetails extends Session {
	id: string;
	projectName: string;
	clientName: string;
}
