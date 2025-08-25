import { useEffect, useState } from 'react';
import { getAllClients } from '@/lib/db/clientStore';
import { getProjectsByClient, getProjectById } from '@/lib/db/projectStore';
import { useDispatch, useSelector } from 'react-redux';
import { loadSessions, startSession, stopSession } from '@/store/sessionsSlice';
import type { RootState, AppDispatch } from '@/store';
import { getAllSessions } from '@/lib/db/sessionStore';
import type { Client, Project } from '@/lib/db/types';
import { useIntl } from 'react-intl';
import styles from './SessionControl.module.css';

export function SessionControl() {
	const intl = useIntl();
	const dispatch = useDispatch<AppDispatch>();
	const currentSessionId = useSelector((state: RootState) => state.sessions.currentSessionId);
	const [clients, setClients] = useState<Client[]>([]);
	const [projects, setProjects] = useState<Project[]>([]);
	const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
	const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);


	// On mount, fetch clients and set initial select values from ongoing session
	useEffect(() => {
		getAllClients().then(setClients);
		getAllSessions().then(async (allSessions) => {
			const ongoing = allSessions.find(s => !s.end);
			if (ongoing) {
				setSelectedProjectId(ongoing.projectId);
				const project = await getProjectById(ongoing.projectId);
				if (project?.clientId) setSelectedClientId(project.clientId);
				// Set Redux currentSessionId if not already set
				if (ongoing.id && currentSessionId !== ongoing.id) {
					dispatch({ type: 'sessions/setCurrentSessionId', payload: ongoing.id });
				}
			}
		});
	}, []);

	// When client changes, update projects
	useEffect(() => {
		if (selectedClientId !== null) {
			getProjectsByClient(selectedClientId).then(setProjects);
		} else {
			setProjects([]);
		}
	}, [selectedClientId]);

	const handleStartSession = async () => {
		if (selectedProjectId === null) return;
		await dispatch(startSession(selectedProjectId)).unwrap();
		await dispatch(loadSessions());
	};

	const handleStopSession = async () => {
		if (currentSessionId !== null) {
			await dispatch(stopSession(currentSessionId)).unwrap();
			await dispatch(loadSessions());
		}
	};
	const isSessionActive = currentSessionId !== null;

	return (
		<div className={styles['session-control']}>
			<div className={styles.fields}>

				<div className="">
					<label className="">
						🔸 {intl.formatMessage({ id: 'SessionControl.client', defaultMessage: 'Client' })}</label>
					<select
						disabled={isSessionActive}
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
				</div>
				<div className="">
					<label className="">
						📁 {intl.formatMessage({ id: 'SessionControl.project', defaultMessage: 'Project' })}</label>
					<select
						disabled={isSessionActive || !selectedClientId}
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
				</div>
			</div>
			<button
				onClick={currentSessionId ? handleStopSession : handleStartSession}
				className={[styles.button, isSessionActive ? "danger" : "success"].join(' ')}
				disabled={!selectedProjectId && !currentSessionId}
			>
				{currentSessionId ? <><svg className="">
					<rect x="6" y="6" width="8" height="8" />
				</svg>{intl.formatMessage({ id: 'SessionControl.endSession', defaultMessage: 'Finalitza la sessió' })}</> : <><svg className="">
					<path d="M6 4l10 6-10 6V4z" />
				</svg>{intl.formatMessage({ id: 'SessionControl.startSession', defaultMessage: 'Inicia la sessió' })}</>}
			</button>
		</div>);
}
