import type { SessionWithDetails } from "@/lib/db/types";
import { useState, type FC } from "react";
import { useIntl } from "react-intl";

interface RowProps {
	session: SessionWithDetails;
	onSave?: (updated: SessionWithDetails) => void;
}

const Row: FC<RowProps> = ({ session, onSave }) => {
	const intl = useIntl();
	const [isEditing, setIsEditing] = useState(false);
	const [draft, setDraft] = useState(session);

	const handleChange = (field: keyof SessionWithDetails, value: string) => {
		setDraft({ ...draft, [field]: value });
	};

	const handleSave = () => {
		onSave?.(draft);
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
						<input
							type="text"
							className="border rounded px-2 py-1 text-sm w-full"
							value={draft.projectName}
							onChange={(e) => handleChange("projectName", e.target.value)}
						/>
					</td>
					<td className="px-2 py-2">
						<input
							type="text"
							className="border rounded px-2 py-1 text-sm w-full"
							value={draft.clientName}
							onChange={(e) => handleChange("clientName", e.target.value)}
						/>
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
