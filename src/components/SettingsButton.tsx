// components/SettingsButton.tsx
import { useDispatch } from 'react-redux';
import { openSettingsModal } from '../store/uiSlice';

export function SettingsButton() {
	const dispatch = useDispatch();

	return (
		<button
			onClick={() => dispatch(openSettingsModal())}
			className="px-3 py-2 bg-neutral-200 dark:bg-neutral-800 rounded text-sm"
		>
			⚙️ Configuració
		</button>
	);
}
