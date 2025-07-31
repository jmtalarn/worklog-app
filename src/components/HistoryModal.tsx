import { useDispatch, useSelector } from 'react-redux';
import { closeHistoryModal } from '@/store/uiSlice';
import { type RootState } from '@/store';
import SessionsList from './SessionsList';

export function HistoryModal() {
	const isOpen = useSelector((state: RootState) => state.ui.showHistoryModal);
	const dispatch = useDispatch();

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-start pt-20 z-50">
			<div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md max-w-xl w-full max-h-[80vh] overflow-y-auto">
				<h2 className="text-xl font-bold mb-4">🕓 Historial de registres</h2>

				<SessionsList />

				<div className="text-right mt-6">
					<button onClick={() => dispatch(closeHistoryModal())} className="text-blue-600 hover:underline">
						✖️ Tanca
					</button>
				</div>
			</div>
		</div>
	);
}
