import { useIntl } from 'react-intl';
import { setDarkMode } from '@/store/settingsSlice';
import { type RootState } from '@/store';
import { useDispatch, useSelector } from 'react-redux';



export const DarkModeSwitch = () => {
	const intl = useIntl();
	const dispatch = useDispatch();
	const darkMode = useSelector((state: RootState) => state.settings.darkMode);
	return (
		<button
			onClick={() => dispatch(setDarkMode(!darkMode))}
			className=""
			title={intl.formatMessage({ id: 'darkModeSwitch.title', defaultMessage: 'Toggle dark/light mode' })}
		>
			🌗 <span className="label">
				{intl.formatMessage({ id: 'darkModeSwitch.label', defaultMessage: 'Mode' })}
			</span>
		</button >
	);
};
