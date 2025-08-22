// components/SettingsButton.tsx
import { useDispatch } from 'react-redux';
import { openSettingsModal } from '../store/uiSlice';

export function SettingsButton() {
	const dispatch = useDispatch();

	return (
		<button
			onClick={() => dispatch(openSettingsModal())}
			className=""
		>
			⚙️ Configuració
		</button>
	);
}
