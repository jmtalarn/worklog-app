import { useDispatch } from 'react-redux';
import { openHistoryModal } from '@/store/uiSlice';

export function HistoryButton() {
	const dispatch = useDispatch();

	return (
		<button
			onClick={() => dispatch(openHistoryModal())}
			className="px-3 py-2 bg-neutral-200 dark:bg-neutral-800 rounded text-sm"
		>
			🕓 Historial
		</button>
	);
}

