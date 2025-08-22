import { useDispatch } from 'react-redux';
import { openHistoryModal } from '@/store/uiSlice';
import { useIntl } from 'react-intl';

export function HistoryButton() {
	const dispatch = useDispatch();
	const intl = useIntl();
	return (
		<button
			onClick={() => dispatch(openHistoryModal())}
			className=""
		>
			🕓 {intl.formatMessage({ id: 'SessionHistory.history', defaultMessage: 'Historial' })}
		</button>
	);
}

