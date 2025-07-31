import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '@/store';
import { closeSettingsModal } from '@/store/uiSlice';
import { type Client, getAllClients, addClient, deleteClient } from '@/lib/db/clientStore';
import { type Project, getProjectsByClient, addProject, deleteProject } from '@/lib/db/projectStore';

export function SettingsModal() {
	const isOpen = useSelector((state: RootState) => state.ui.showSettingsModal);
	const dispatch = useDispatch();

	const [clients, setClients] = useState<Client[]>([]);
	const [projectsByClient, setProjectsByClient] = useState<Record<string, Project[]>>({});
	const [newClientName, setNewClientName] = useState('');
	const [newProjectName, setNewProjectName] = useState<Record<string, string>>({});

	useEffect(() => {
		if (isOpen) {
			loadData();
		}
	}, [isOpen]);

	const loadData = async () => {
		const loadedClients = await getAllClients();
		setClients(loadedClients);

		const projects: Record<string, Project[]> = {};
		for (const client of loadedClients) {
			projects[client.id!] = await getProjectsByClient(client.id!);
		}
		setProjectsByClient(projects);
	};

	const handleAddClient = async () => {
		if (!newClientName.trim()) return;
		await addClient({ name: newClientName });
		setNewClientName('');
		await loadData();
	};

	const handleDeleteClient = async (id?: string) => {
		if (!id) return;
		await deleteClient(id);
		await loadData();
	};

	const handleAddProject = async (clientId: string) => {
		const name = newProjectName[clientId];
		if (!name?.trim()) return;
		await addProject({ name, clientId });
		setNewProjectName((prev) => ({ ...prev, [clientId]: '' }));
		await loadData();
	};

	const handleDeleteProject = async (projectId: string) => {
		await deleteProject(projectId);
		await loadData();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-start pt-20 z-50">
			<div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md max-w-xl w-full max-h-[80vh] overflow-y-auto">
				<h2 className="text-xl font-bold mb-4">⚙️ Configuració</h2>

				<div className="space-y-4">
					{clients.map((client) => (
						<div key={client.id} className="border p-3 rounded">
							<div className="flex justify-between items-center">
								<strong>🔸 {client.name}</strong>
								{!client.isPersonal && (
									<button
										onClick={() => handleDeleteClient(client.id)}
										className="text-red-600 hover:underline"
									>
										🗑 Elimina client
									</button>
								)}
							</div>

							<div className="ml-4 mt-2 space-y-1">
								{projectsByClient[client.id!]?.map((project) => (
									<div key={project.id} className="flex justify-between items-center">
										<span>- 📁 {project.name}</span>
										<button
											onClick={() => handleDeleteProject(project.id!)}
											className="text-red-500 text-sm hover:underline"
										>
											🗑
										</button>
									</div>
								))}

								<div className="flex mt-2 gap-2">
									<input
										type="text"
										placeholder="Nou projecte"
										value={newProjectName[client.id!] || ''}
										onChange={(e) =>
											setNewProjectName((prev) => ({ ...prev, [client.id!]: e.target.value }))
										}
										className="flex-1 p-1 border rounded"
									/>
									<button
										onClick={() => handleAddProject(client.id!)}
										className="bg-blue-600 text-white px-2 rounded"
									>
										➕ Afegir
									</button>
								</div>
							</div>
						</div>
					))}

					<div className="flex gap-2">
						<input
							type="text"
							placeholder="Nom del nou client"
							value={newClientName}
							onChange={(e) => setNewClientName(e.target.value)}
							className="flex-1 p-2 border rounded"
						/>
						<button onClick={handleAddClient} className="bg-green-600 text-white px-4 rounded">
							➕ Afegir Client
						</button>
					</div>
				</div>

				<div className="text-right mt-6">
					<button onClick={() => dispatch(closeSettingsModal())} className="text-blue-600 hover:underline">
						✖️ Tanca
					</button>
				</div>
			</div>
		</div>
	);
}
