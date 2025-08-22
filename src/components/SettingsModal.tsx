import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '@/store';
import { closeSettingsModal } from '@/store/uiSlice';
import { type Client, getAllClients, addClient, deleteClient } from '@/lib/db/clientStore';
import { type Project, getProjectsByClient, addProject, deleteProject } from '@/lib/db/projectStore';

export function SettingsModal() {
	const isOpen = useSelector((state: RootState) => state.ui.showSettingsModal);
	const dispatch = useDispatch();
	const dialogRef = useRef<HTMLDialogElement | null>(null);

	const [clients, setClients] = useState<Client[]>([]);
	const [projectsByClient, setProjectsByClient] = useState<Record<string, Project[]>>({});
	const [newClientName, setNewClientName] = useState('');
	const [newProjectName, setNewProjectName] = useState<Record<string, string>>({});

	// useEffect(() => {
	// 	if (isOpen) {
	// 		loadData();
	// 		dialogRef.current?.showModal();
	// 	} else {
	// 		dialogRef.current?.close();
	// 	}
	// }, [isOpen]);
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (isOpen && !dialog.open) {
			loadData();
			dialog.showModal();
		} else if (!isOpen && dialog.open) {
			dialog.close();
		}
	}, [isOpen]);

	// Sync Redux state when the user closes the dialog via Esc or backdrop
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		const handleClose = () => {
			// If the dialog closed by user action, reflect that in Redux
			if (isOpen) dispatch(closeHistoryModal());
		};

		// Optional: intercept "cancel" (Esc/backdrop) and let Redux drive the close
		// If you prefer this behavior, uncomment the cancel handler.
		// const handleCancel = (e: Event) => {
		//   e.preventDefault();            // stop the native auto-close
		//   dispatch(closeHistoryModal()); // Redux -> effect above calls dialog.close()
		// };

		dialog.addEventListener('close', handleClose);
		// dialog.addEventListener('cancel', handleCancel);

		return () => {
			dialog.removeEventListener('close', handleClose);
			// dialog.removeEventListener('cancel', handleCancel);
		};
	}, [dispatch, isOpen]);


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

	//if (!isOpen) return null;

	return (
		<dialog ref={dialogRef}>
			<div className="">
				<div className="">
					<h2 className="">⚙️ Configuració</h2>

					<div className="">
						{clients.map((client) => (
							<div key={client.id} className="">
								<div className="">
									<strong>🔸 {client.name}</strong>
									{!client.isPersonal && (
										<button
											onClick={() => handleDeleteClient(client.id)}
											className=""
										>
											🗑 Elimina client
										</button>
									)}
								</div>

								<div className="">
									{projectsByClient[client.id!]?.map((project) => (
										<div key={project.id} className="">
											<span>- 📁 {project.name}</span>
											<button
												onClick={() => handleDeleteProject(project.id!)}
												className=""
											>
												🗑
											</button>
										</div>
									))}

									<div className="">
										<input
											type="text"
											placeholder="Nou projecte"
											value={newProjectName[client.id!] || ''}
											onChange={(e) =>
												setNewProjectName((prev) => ({ ...prev, [client.id!]: e.target.value }))
											}
											className=""
										/>
										<button
											onClick={() => handleAddProject(client.id!)}
											className=""
										>
											➕ Afegir
										</button>
									</div>
								</div>
							</div>
						))}

						<div className="">
							<input
								type="text"
								placeholder="Nom del nou client"
								value={newClientName}
								onChange={(e) => setNewClientName(e.target.value)}
								className=""
							/>
							<button onClick={handleAddClient} className="">
								➕ Afegir Client
							</button>
						</div>
					</div>

					<div className="">
						<button onClick={() => dispatch(closeSettingsModal())} className="">
							✖️ Tanca
						</button>
					</div>
				</div>
			</div>
		</dialog>
	);
}
