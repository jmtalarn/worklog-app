import { useIntl } from 'react-intl';

export const DarkModeSwitch = () => {
	const intl = useIntl();
	return (
		<button
			onClick={() => document.documentElement.classList.toggle('dark')}
			className=""
			title={intl.formatMessage({ id: 'darkModeSwitch.title', defaultMessage: 'Toggle dark/light mode' })}
		>
			🌗 <span className="label">
				{intl.formatMessage({ id: 'darkModeSwitch.label', defaultMessage: 'Mode' })}
			</span>
		</button>
	);
};
