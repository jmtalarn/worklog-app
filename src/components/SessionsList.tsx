import { getClientById } from '@/lib/db/clientStore';
import { getProjectById } from '@/lib/db/projectStore';
import { getAllSessions } from '@/lib/db/sessionStore';
import type { Session } from '@/lib/db/types';
import type { AppDispatch, RootState } from '@/store';
import { loadSessions } from '@/store/sessionsSlice';
import { useEffect, useState, type FC } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

interface SessionWithDetails extends Session {
	id: string;
	projectName: string;
	clientName: string;
}

interface Props {
	sessions: SessionWithDetails[];
}

const SessionList: FC<Props> = ({ sessions }) => {
	const intl = useIntl();

	if (sessions.length === 0) {
		return <p className="text-sm text-gray-500">🔎 No s'ha trobat cap sessió registrada.</p>;
	}

	return (
		<div>
			<h2 className="text-lg font-semibold mt-4">📋 Sessions registrades:</h2>
			<ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
				{[...sessions]
					.sort((a, b) => new Date(b.start).toISOString().localeCompare(new Date(a.start).toISOString()))
					.map((s) => (
						<li key={s.id}>
							{intl.formatDate(s.start, { dateStyle: 'medium', timeStyle: 'short' })} —{' '}
							{s.end
								? intl.formatDate(s.end, { dateStyle: 'medium', timeStyle: 'short' })
								: intl.formatMessage({ id: 'sessionStatus.workInProgress', defaultMessage: 'Treball en curs' })}
							<br />
							<span className="text-gray-500">
								({s.projectName} — {s.clientName})
							</span>
						</li>
					))}
			</ul>
		</div >
	);
};

export default function SessionListFromStore() {
	const intl = useIntl();
	const sessions = useSelector((state: RootState) => state.sessions.sessions);
	const [detailedSessions, setDetailedSessions] = useState<SessionWithDetails[]>([]);

	useEffect(() => {
		const enrich = async () => {
			const detailed = await Promise.all(
				sessions.map(async (s) => {
					const project = s.projectId ? await getProjectById(s.projectId) : null;
					const client = project?.clientId ? await getClientById(project.clientId) : null;

					return {
						...s,
						id: s.id ?? '',
						projectName: project?.name ?? intl.formatMessage({ id: 'unknownProject', defaultMessage: 'Projecte desconegut' }),
						clientName: client?.name ?? intl.formatMessage({ id: 'unknownClient', defaultMessage: 'Client desconegut' }),
					};
				})
			);
			setDetailedSessions(detailed);
		};

		enrich();
	}, [sessions, intl]);

	return <SessionList sessions={detailedSessions} />;
}
