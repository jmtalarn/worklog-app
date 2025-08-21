import { getAllClients } from "@/lib/db/clientStore";
import { getProjectById, getProjectsByClient } from "@/lib/db/projectStore";
import type { Client, Project, SessionWithDetails } from "@/lib/db/types";
import type { AppDispatch } from '@/store';
import { loadSessions, updateSession } from '@/store/sessionsSlice';
import { useCallback, useEffect, useState, type FC } from "react";
import { useIntl } from "react-intl";
import { useDispatch } from 'react-redux';

interface RowProps {
	session: SessionWithDetails;
	onSave?: (updated: SessionWithDetails) => void;
}

const Row: FC<RowProps> = ({ session, onSave }) => {
	const intl = useIntl();
	const [isEditing, setIsEditing] = useState(false);
	const [draft, setDraft] = useState(session);
	const dispatch = useDispatch<AppDispatch>();
	const [clients, setClients] = useState<Client[]>([]);
	const [projects, setProjects] = useState<Project[]>([]);
	const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
	const [selectedProjectId, setSelectedProjectId] = useState<string | null>(session.projectId || null);
	const handleChange = useCallback((field: keyof SessionWithDetails, value: string) => {
		setDraft({ ...draft, [field]: value });
	}, []);

	// On mount, fetch clients and set initial select values from ongoing session
	useEffect(() => {
		getAllClients().then((clients) => {
			setClients(clients);
			if (session.projectId) {
				getProjectById(session.projectId).then((project) => {
					if (project?.clientId) {
						setSelectedClientId(project.clientId);
					}
				});
			}
		});

	}, []);
	// When client changes, update projects
	useEffect(() => {
		if (selectedClientId !== null) {
			getProjectsByClient(selectedClientId).then((projects: Project[]) => {
				setProjects(projects);
				if (projects.findIndex((p) => (p.id === selectedProjectId)) === -1) {
					setSelectedProjectId(null);
				}
			});
		} else {
			setProjects([]);
		}
	}, [selectedClientId, selectedProjectId]);

	useEffect(() => {
		if (selectedProjectId !== null && selectedProjectId !== draft.projectId) {
			handleChange("projectId", selectedProjectId);
		}
	}, [selectedProjectId, handleChange, draft.projectId]);



	const handleSave = async () => {
		onSave?.(draft);

		await dispatch(updateSession({ sessionId: session.id, updates: draft })).unwrap();
		await dispatch(loadSessions());

		setIsEditing(false);
	};

	return (
		<tr
			className="hover:bg-gray-50 cursor-pointer"
			onClick={() => !isEditing && setIsEditing(true)}
			title={intl.formatMessage({
				id: "sessionTable.clicktoedit",
				defaultMessage: "Clica per editar",
			})}
		>
			{isEditing ? (
				<>
					<td className="px-2 py-2">
						<input
							type="datetime-local"
							className="border rounded px-2 py-1 text-sm w-full"
							value={new Date(draft.start).toISOString().slice(0, 16)}
							onChange={(e) => handleChange("start", e.target.value)}
						/>
					</td>
					<td className="px-2 py-2">
						<input
							type="datetime-local"
							className="border rounded px-2 py-1 text-sm w-full"
							value={
								draft.end
									? new Date(draft.end).toISOString().slice(0, 16)
									: ""
							}
							onChange={(e) => handleChange("end", e.target.value)}
						/>
					</td>
					<td className="px-2 py-2">

						<select
							value={selectedProjectId ?? ''}
							onChange={(e) => setSelectedProjectId(e.target.value)}
							className="border rounded px-2 py-1 text-sm w-full"
						>
							<option value="">{intl.formatMessage({ id: 'SessionControl.selectProject', defaultMessage: '— Tria projecte —' })}</option>
							{projects.map((project) => (
								<option key={project.id} value={project.id}>
									{project.name}
								</option>
							))}
						</select>
					</td>
					<td className="px-2 py-2">
						<select
							value={selectedClientId ?? ''}
							onChange={(e) => setSelectedClientId(e.target.value)}
							className="border rounded px-2 py-1 text-sm w-full"
						>
							<option value="">{intl.formatMessage({ id: 'SessionControl.selectClient', defaultMessage: '— Tria client —' })}</option>
							{clients.map((client) => (
								<option key={client.id} value={client.id}>
									{client.name}
								</option>
							))}
						</select>
					</td>
					<td className="px-2 py-2 text-right">
						<div className="flex items-center gap-1 justify-end">
							<button
								onClick={handleSave}
								className="bg-blue-600 text-white px-2 py-2 rounded text-xs whitespace-nowrap flex-shrink"
								style={{ minWidth: "0" }}
							>
								💾 {intl.formatMessage({
									id: "save",
									defaultMessage: "Desa",
								})}
							</button>
							<button
								onClick={() => setIsEditing(false)}
								className="bg-gray-300 text-gray-800 px-2 py-2 rounded text-xs whitespace-nowrap flex-shrink"
								style={{ minWidth: "0" }}
							>
								✖ {intl.formatMessage({
									id: "cancel",
									defaultMessage: "Cancel·la",
								})}
							</button>
						</div>
					</td>
				</>
			) : (
				<>
					<td className="px-2 py-2 text-sm text-gray-800">
						{intl.formatDate(session.start, {
							dateStyle: "medium",
							timeStyle: "short",
						})}
					</td>
					<td className="px-2 py-2 text-sm text-gray-800">
						{session.end
							? intl.formatDate(session.end, {
								dateStyle: "medium",
								timeStyle: "short",
							})
							: intl.formatMessage({
								id: "sessionStatus.workInProgress",
								defaultMessage: "Treball en curs",
							})}
					</td>
					<td className="px-2 py-2 text-sm text-gray-800">
						{session.projectName}
					</td>
					<td className="px-2 py-2 text-sm text-gray-800">
						{session.clientName}
					</td>
				</>
			)}
		</tr>
	);
};

export default Row;
