import { useI18n } from '@/i18n/i18n';
import { useIntl } from 'react-intl';

export const LanguageSelector = () => {
	const { locale, setLocale } = useI18n();
	const intl = useIntl();

	return (
		<select
			value={locale}
			onChange={(e) => setLocale(e.target.value as 'ca' | 'es' | 'en')}
			className="p-1 border rounded"
		>
			<option value="ca">{intl.formatMessage({ id: 'lang.ca' })}</option>
			<option value="es">{intl.formatMessage({ id: 'lang.es' })}</option>
			<option value="en">{intl.formatMessage({ id: 'lang.en' })}</option>
		</select>
	);
};
