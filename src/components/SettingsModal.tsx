import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '@/store';
import { closeSettingsModal } from '@/store/uiSlice';
import { type Client, getAllClients, addClient, deleteClient } from '@/lib/db/clientStore';
import { type Project, getProjectsByClient, addProject, deleteProject } from '@/lib/db/projectStore';
import modalStyles from './Modal.module.css';
import { useIntl } from 'react-intl';

export function SettingsModal() {
	const isOpen = useSelector((state: RootState) => state.ui.showSettingsModal);
	const dispatch = useDispatch();
	const dialogRef = useRef<HTMLDialogElement | null>(null);

	const [clients, setClients] = useState<Client[]>([]);
	const [projectsByClient, setProjectsByClient] = useState<Record<string, Project[]>>({});
	const [newClientName, setNewClientName] = useState('');
	const [newProjectName, setNewProjectName] = useState<Record<string, string>>({});
	const intl = useIntl();
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
			if (isOpen) dispatch(closeSettingsModal());
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
		<dialog ref={dialogRef} className={[modalStyles.dialog, modalStyles.settings].join(' ')}>
			<header className={modalStyles.header}>
				<h2>⚙️ {intl.formatMessage({ id: 'Settings.settings', defaultMessage: 'Configuració' })}</h2>
				<button onClick={() => dispatch(closeSettingsModal())} className="">
					✖️ {intl.formatMessage({ id: 'close', defaultMessage: 'Tanca' })}
				</button>
			</header>
			<div className={modalStyles.inputRow}>
				<input
					type="text"
					placeholder={intl.formatMessage({ id: 'Settings.newClient', defaultMessage: 'Nom del nou client' })}
					value={newClientName}
					onChange={(e) => setNewClientName(e.target.value)}
				/>
				<button onClick={handleAddClient} className="">
					➕ {intl.formatMessage({ id: 'Settings.addClient', defaultMessage: 'Afegir client' })}
				</button>
			</div>
			<div className={modalStyles.section}>
				{clients.map((client) => (
					<div key={client.id} className={modalStyles.client}>
						<div className={[modalStyles.clientHeader, modalStyles.row].join(' ')}>
							<strong>🔸 {client.name}</strong>
							{!client.isPersonal && (
								<button
									onClick={() => handleDeleteClient(client.id)}
									className=""
								>
									🗑 {intl.formatMessage({ id: 'Settings.deleteClient', defaultMessage: 'Elimina client' })}
								</button>
							)}
						</div>

						<div >
							{projectsByClient[client.id!]?.map((project) => (
								<div key={project.id} className={[modalStyles.project, modalStyles.row].join(' ')}>
									<span>- 📁 {project.name}</span>
									<button
										onClick={() => handleDeleteProject(project.id!)}
										className=""
									>
										🗑
									</button>
								</div>
							))}

							<div className={modalStyles.inputRow}>
								<input
									type="text"
									placeholder={intl.formatMessage({ id: 'Settings.newProject', defaultMessage: 'Nou projecte' })}
									value={newProjectName[client.id!] || ''}
									onChange={(e) =>
										setNewProjectName((prev) => ({ ...prev, [client.id!]: e.target.value }))
									}

								/>
								<button
									onClick={() => handleAddProject(client.id!)}
									className=""
								>
									➕ {intl.formatMessage({ id: 'Settings.addProject', defaultMessage: 'Afegir projecte' })}
								</button>
							</div>
						</div>
					</div>
				))}


			</div>

		</dialog>
	);
}
