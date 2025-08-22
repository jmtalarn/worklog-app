import { getClientById } from '@/lib/db/clientStore';
import { getProjectById } from '@/lib/db/projectStore';
import type { SessionWithDetails } from '@/lib/db/types';
import type { RootState } from '@/store';
import { useEffect, useState, type FC } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import Row from './SessionListRow';


interface Props {
	sessions: SessionWithDetails[];
}

const SessionList: FC<Props> = ({ sessions }) => {
	const intl = useIntl();

	if (sessions.length === 0) {
		return <p className="">🔎 No s'ha trobat cap sessió registrada.</p>;
	}

	return (
		<div >
			<h2 className="">📋 Sessions registrades:</h2>
			<table className="">
				<thead className="">
					<tr>
						<th className="">
							{intl.formatMessage({ id: 'sessionTable.start', defaultMessage: 'Start' })}
						</th>
						<th className="">
							{intl.formatMessage({ id: 'sessionTable.end', defaultMessage: 'End' })}
						</th>
						<th className="">
							{intl.formatMessage({ id: 'sessionTable.project', defaultMessage: 'Project' })}
						</th>
						<th className="">
							{intl.formatMessage({ id: 'sessionTable.client', defaultMessage: 'Client' })}
						</th>
					</tr>
				</thead>
				<tbody className="">
					{[...sessions]
						.sort((a, b) => new Date(b.start).toISOString().localeCompare(new Date(a.start).toISOString()))
						.map((s) => (
							<Row session={s} key={s.id} />
						))}
				</tbody>
			</table>
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
