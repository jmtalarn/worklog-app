import { getClientById } from '@/lib/db/clientStore';
import { getProjectById } from '@/lib/db/projectStore';
import type { SessionWithDetails } from '@/lib/db/types';
import type { RootState } from '@/store';
import { useEffect, useState, type FC } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import Row from './SessionListRow';
import styles from './SessionsList.module.css';

interface Props {
	sessions: SessionWithDetails[];
}

function exportToCSV(data: SessionWithDetails[], filename = "export.csv") {
	if (!data || !data.length) {
		console.warn("No data to export");
		return;
	}

	const headerOrder = ['id', 'start', 'end', 'projectId', 'projectName', 'clientId', 'clientName'];
	const headers = headerOrder.filter(h => h in data[0]);

	const rows = data.map(row =>
		headers.map(fieldName => {
			let value = row[fieldName] ?? "";
			if (typeof value === "string") {
				value = value.replace(/"/g, '""');
			}
			return `"${value}"`;
		}).join(",")
	);

	const csvContent = [headers.join(","), ...rows].join("\n");

	const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);

	const link = document.createElement("a");
	link.href = url;
	link.setAttribute("download", filename);
	document.body.appendChild(link);
	link.click();

	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

const SessionList: FC<Props> = ({ sessions }) => {
	const intl = useIntl();

	if (sessions.length === 0) {
		return <p className="">🔎 No s'ha trobat cap sessió registrada.</p>;
	}

	return (<>

		<h2 className="">📋 Sessions registrades:</h2>
		<div className={styles.tableWrap}>
			<table className={styles.table}>
				<thead className="">
					<tr>
						<th className="">
							{intl.formatMessage({ id: 'sessionTable.start', defaultMessage: 'Start' })}
						</th>
						<th className="">
							{intl.formatMessage({ id: 'sessionTable.end', defaultMessage: 'End' })}
						</th>
						<th className="">
							{intl.formatMessage({ id: 'sessionTable.hours', defaultMessage: 'Hours' })}
						</th>
						<th className="">
							{intl.formatMessage({ id: 'sessionTable.project', defaultMessage: 'Project' })}
						</th>
						<th className="">
							{intl.formatMessage({ id: 'sessionTable.client', defaultMessage: 'Client' })}
						</th>
						<th>&nbsp;</th>
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
		<footer className={styles.footer}>
			<button
				onClick={() => {
					const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
					exportToCSV(sessions, `sessions_export_${timestamp}.csv`);
				}}
			>
				{intl.formatMessage({ id: 'export', defaultMessage: 'Exporta dades' })}
			</button>
		</footer>
	</>
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
						clientId: project?.clientId ?? '',
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
