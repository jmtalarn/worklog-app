import { useEffect, useState } from 'react';
import { getAllClients } from '@/lib/db/clientStore';
import { getProjectsByClient, getProjectById } from '@/lib/db/projectStore';
import { useDispatch, useSelector } from 'react-redux';
import { loadSessions, startSession, stopSession } from '@/store/sessionsSlice';
import type { RootState, AppDispatch } from '@/store';
import { getAllSessions } from '@/lib/db/sessionStore';
import type { Client, Project } from '@/lib/db/types';
import { useIntl } from 'react-intl';

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
	const buttonColor = isSessionActive ? 'red' : 'green';
	return (
		<div className="flex flex-wrap items-end gap-3 ">
			<div className="flex flex-col gap-1">
				<label className="text-sm font-medium text-gray-700 flex items-center gap-1">
					🔸 {intl.formatMessage({ id: 'SessionControl.client', defaultMessage: 'Client' })}</label>
				<select
					disabled={isSessionActive}
					value={selectedClientId ?? ''}
					onChange={(e) => setSelectedClientId(e.target.value)}
					className="min-w-[180px] px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-800 bg-white disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="">{intl.formatMessage({ id: 'SessionControl.selectClient', defaultMessage: '— Tria client —' })}</option>
					{clients.map((client) => (
						<option key={client.id} value={client.id}>
							{client.name}
						</option>
					))}
				</select>
			</div>
			<div className="flex flex-col gap-1">
				<label className="text-sm font-medium text-gray-700 flex items-center gap-1">
					📁 {intl.formatMessage({ id: 'SessionControl.project', defaultMessage: 'Project' })}</label>
				<select
					disabled={isSessionActive || !selectedClientId}
					value={selectedProjectId ?? ''}
					onChange={(e) => setSelectedProjectId(e.target.value)}
					className="min-w-[180px] px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-800 bg-white disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="">{intl.formatMessage({ id: 'SessionControl.selectProject', defaultMessage: '— Tria projecte —' })}</option>
					{projects.map((project) => (
						<option key={project.id} value={project.id}>
							{project.name}
						</option>
					))}
				</select>
			</div>
			<button
				onClick={currentSessionId ? handleStopSession : handleStartSession}
				className={
					`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white 
					bg-${buttonColor}-600 rounded-md hover:bg-${buttonColor}-700 
					transition 
					focus:outline-none focus:ring-2 focus:ring-${buttonColor}-400 
					min-w-[180px] justify-center text-center
					disabled:opacity-50 disabled:cursor-not-allowed
					`}
				disabled={!selectedProjectId && !currentSessionId}
			>
				{currentSessionId ? <><svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
					<rect x="6" y="6" width="8" height="8" />
				</svg>{intl.formatMessage({ id: 'SessionControl.endSession', defaultMessage: 'Finalitza la sessió' })}</> : <><svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
					<path d="M6 4l10 6-10 6V4z" />
				</svg>{intl.formatMessage({ id: 'SessionControl.startSession', defaultMessage: 'Inicia la sessió' })}</>}
			</button>
		</div>);
}
