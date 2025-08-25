import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { useIntl } from 'react-intl';
import { useMemo } from 'react';
import styles from './SessionStatus.module.css';

const SessionStatus = () => {
	const intl = useIntl();

	const sessions = useSelector((state: RootState) => state.sessions.sessions);
	const currentSessionId = useSelector((state: RootState) => state.sessions.currentSessionId);
	const projects = useSelector((state: RootState) => state.projects.list);
	const clients = useSelector((state: RootState) => state.clients.list);

	// useEffect(() => {
	// 		getAllClients().then(setClients);
	// 		getAllSessions().then(async (allSessions) => {
	// 			const ongoing = allSessions.find(s => !s.end);
	// 			if (ongoing) {
	// 				setSelectedProjectId(ongoing.projectId);
	// 				const project = await getProjectById(ongoing.projectId);
	// 				if (project?.clientId) setSelectedClientId(project.clientId);
	// 				// Set Redux currentSessionId if not already set
	// 				if (ongoing.id && currentSessionId !== ongoing.id) {
	// 					dispatch({ type: 'sessions/setCurrentSessionId', payload: ongoing.id });
	// 				}
	// 			}
	// 		});
	// 		refreshSessions();
	// 		// eslint-disable-next-line react-hooks/exhaustive-deps
	// 	}, []);


	const activeSession = useMemo(() => {
		if (!currentSessionId) return null;
		return sessions.find((s) => s.id === currentSessionId && !s.end) || null;
	}, [sessions, currentSessionId]);

	const project = useMemo(() => {
		if (!activeSession) return null;
		return projects.find((p) => p.id === activeSession.projectId) || null;
	}, [projects, activeSession]);

	const client = useMemo(() => {
		if (!project) return null;
		return clients.find((c) => c.id === project.clientId) || null;
	}, [clients, project]);

	const isActive = !!activeSession;

	const statusText = isActive
		? intl.formatMessage({ id: 'sessionStatus.workInProgress', defaultMessage: 'Sessió en curs' })
		: intl.formatMessage({ id: 'sessionStatus.notWorking', defaultMessage: 'Cap sessió activa' });

	const emoji = isActive ? '🟢 ' : '⚪️ ';

	const startedAt = activeSession
		? new Date(activeSession.start).toLocaleString()
		: null;

	return (
		<div className={styles.status}>
			<div className="">
				<span>{emoji}</span>
				<span>{statusText}</span>
			</div>


			<div className="">
				{isActive && startedAt ? <div>⏱️ Inici: <strong>{startedAt}</strong></div> : <div>&nbsp;</div>}
			</div>

		</div>
	);
};

export default SessionStatus;
