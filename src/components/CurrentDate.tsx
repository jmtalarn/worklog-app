import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '@/i18n/i18n';

const CurrentDate = () => {
	const { locale } = useI18n();
	const [now, setNow] = useState(new Date());
	useEffect(() => {
		const timer = setInterval(() => {
			setNow(new Date());
		}, 1000);

		return () => clearInterval(timer);
	}, []);
	const formatted = useMemo(() =>
		now.toLocaleDateString(locale, {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			weekday: 'long',
		}) + ' ' + now.toLocaleTimeString(locale, {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false,
		}),
		[locale, now]
	);

	return (
		<span className="inline-block w-[300px] text-sm  whitespace-nowrap" >{formatted}</span>
	);
};

export default CurrentDate;
