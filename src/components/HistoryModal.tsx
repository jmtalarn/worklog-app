import { useDispatch, useSelector } from 'react-redux';
import { closeHistoryModal } from '@/store/uiSlice';
import { type RootState } from '@/store';
import SessionsList from './SessionsList';
import { useIntl } from 'react-intl';

export function HistoryModal() {
	const isOpen = useSelector((state: RootState) => state.ui.showHistoryModal);
	const intl = useIntl();
	const dispatch = useDispatch();

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-start pt-20 z-50">
			<div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md max-w-4xl w-full max-h-[80vh] overflow-y-auto">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-xl font-bold flex items-center">
						<span className="mr-2">🕓</span>
						{intl.formatMessage({ id: 'SessionHistory.sessionsHistory', defaultMessage: 'Historial de registres' })}
					</h2>
					<button
						onClick={() => dispatch(closeHistoryModal())}
						className="text-blue-600 hover:underline flex items-center"
					>
						<span className="mr-1">✖️</span>
						{intl.formatMessage({ id: 'close', defaultMessage: 'Tanca' })}
					</button>
				</div>

				<SessionsList />


			</div>
		</div>
	);
}
