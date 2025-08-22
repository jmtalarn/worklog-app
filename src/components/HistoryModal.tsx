import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import { closeHistoryModal } from '@/store/uiSlice';
import { type RootState } from '@/store';
import SessionsList from './SessionsList';
import { useIntl } from 'react-intl';

export function HistoryModal() {
	const isOpen = useSelector((state: RootState) => state.ui.showHistoryModal);
	const intl = useIntl();
	const dispatch = useDispatch();
	const dialogRef = useRef<HTMLDialogElement | null>(null);

	// if (!isOpen) return null;
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (isOpen && !dialog.open) {
			dialog.showModal();
		} else if (!isOpen && dialog.open) {
			dialog.close();
		}
	}, [isOpen]);

	// Sync Redux state when the user closes the dialog via Esc or backdrop
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		const handleClose = () => {
			// If the dialog closed by user action, reflect that in Redux
			if (isOpen) dispatch(closeHistoryModal());
		};

		// Optional: intercept "cancel" (Esc/backdrop) and let Redux drive the close
		// If you prefer this behavior, uncomment the cancel handler.
		// const handleCancel = (e: Event) => {
		//   e.preventDefault();            // stop the native auto-close
		//   dispatch(closeHistoryModal()); // Redux -> effect above calls dialog.close()
		// };

		dialog.addEventListener('close', handleClose);
		// dialog.addEventListener('cancel', handleCancel);

		return () => {
			dialog.removeEventListener('close', handleClose);
			// dialog.removeEventListener('cancel', handleCancel);
		};
	}, [dispatch, isOpen]);

	return (
		<dialog ref={dialogRef}>
			<div className="">
				<div className="">
					<div className="">
						<h2 className="">
							<span className="">🕓</span>
							{intl.formatMessage({ id: 'SessionHistory.sessionsHistory', defaultMessage: 'Historial de registres' })}
						</h2>
						<button
							onClick={() => dispatch(closeHistoryModal())}
							className=""
						>
							<span className="">✖️</span>
							{intl.formatMessage({ id: 'close', defaultMessage: 'Tanca' })}
						</button>
					</div>

					<SessionsList />


				</div>
			</div>
		</dialog>
	);
}
