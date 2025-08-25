// components/SettingsButton.tsx
import { useDispatch } from 'react-redux';
import { openSettingsModal } from '../store/uiSlice';
import { FormattedMessage } from 'react-intl';
export function SettingsButton() {
	const dispatch = useDispatch();

	return (
		<button
			onClick={() => dispatch(openSettingsModal())}
			className=""
		>
			⚙️ <span className="label"><FormattedMessage id="Settings.settings" defaultMessage="Configuració" /></span>
		</button>
	);
}
