import { useDispatch } from 'react-redux';
import { openHistoryModal } from '@/store/uiSlice';
import { useIntl } from 'react-intl';

export function HistoryButton() {
	const dispatch = useDispatch();
	const intl = useIntl();
	return (
		<button
			onClick={() => dispatch(openHistoryModal())}
			className="px-3 py-2 bg-neutral-200 dark:bg-neutral-800 rounded text-sm"
		>
			🕓 {intl.formatMessage({ id: 'SessionHistory.history', defaultMessage: 'Historial' })}
		</button>
	);
}

