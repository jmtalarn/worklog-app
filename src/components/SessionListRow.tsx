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
			className=""
			onClick={() => !isEditing && setIsEditing(true)}
			title={intl.formatMessage({
				id: "sessionTable.clicktoedit",
				defaultMessage: "Clica per editar",
			})}
		>
			{isEditing ? (
				<>
					<td className="">
						<input
							type="datetime-local"
							className=""
							value={new Date(draft.start).toISOString().slice(0, 16)}
							onChange={(e) => handleChange("start", e.target.value)}
						/>
					</td>
					<td className="">
						<input
							type="datetime-local"
							className=""
							value={
								draft.end
									? new Date(draft.end).toISOString().slice(0, 16)
									: ""
							}
							onChange={(e) => handleChange("end", e.target.value)}
						/>
					</td>
					<td className="">

						<select
							value={selectedProjectId ?? ''}
							onChange={(e) => setSelectedProjectId(e.target.value)}
							className=""
						>
							<option value="">{intl.formatMessage({ id: 'SessionControl.selectProject', defaultMessage: '— Tria projecte —' })}</option>
							{projects.map((project) => (
								<option key={project.id} value={project.id}>
									{project.name}
								</option>
							))}
						</select>
					</td>
					<td className="">
						<select
							value={selectedClientId ?? ''}
							onChange={(e) => setSelectedClientId(e.target.value)}
							className=""
						>
							<option value="">{intl.formatMessage({ id: 'SessionControl.selectClient', defaultMessage: '— Tria client —' })}</option>
							{clients.map((client) => (
								<option key={client.id} value={client.id}>
									{client.name}
								</option>
							))}
						</select>
					</td>
					<td className="">
						<div className="">
							<button
								onClick={handleSave}
								className=""
								style={{ minWidth: "0" }}
							>
								💾 {intl.formatMessage({
									id: "save",
									defaultMessage: "Desa",
								})}
							</button>
							<button
								onClick={() => setIsEditing(false)}
								className=""
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
					<td className="">
						{intl.formatDate(session.start, {
							dateStyle: "medium",
							timeStyle: "short",
						})}
					</td>
					<td className="">
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
					<td className="">
						{session.projectName}
					</td>
					<td className="">
						{session.clientName}
					</td>
				</>
			)}
		</tr>
	);
};

export default Row;
