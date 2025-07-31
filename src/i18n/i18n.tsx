import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { IntlProvider } from 'react-intl';

import ca from './translations/ca.json';
import es from './translations/es.json';
import en from './translations/en.json';

const messages = { ca, es, en };
const defaultLocale: Locale = 'ca';
const supportedLocales = ['ca', 'es', 'en'] as const;
const storageKey = 'preferredLocale';

type Locale = (typeof supportedLocales)[number];

interface I18nContextType {
	locale: Locale;
	setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const useI18n = () => {
	const ctx = useContext(I18nContext);
	if (!ctx) throw new Error('useI18n must be used within I18nProvider');
	return ctx;
};

// 🔍 Detecta l’idioma del navegador
const detectBrowserLocale = (): Locale => {
	const lang = navigator.language.toLowerCase();

	if (lang.startsWith('ca')) return 'ca';
	if (lang.startsWith('es')) return 'es';
	if (lang.startsWith('en')) return 'en';

	return defaultLocale;
};

export const I18nProvider = ({ children }: { children: ReactNode }) => {
	const [locale, setLocaleState] = useState<Locale>(() => {
		const stored = localStorage.getItem(storageKey);
		if (stored && supportedLocales.includes(stored as Locale)) {
			return stored as Locale;
		}
		return detectBrowserLocale();
	});

	const setLocale = (newLocale: Locale) => {
		setLocaleState(newLocale);
		localStorage.setItem(storageKey, newLocale);
	};

	useEffect(() => {
		const onStorage = (e: StorageEvent) => {
			if (e.key === storageKey && e.newValue && supportedLocales.includes(e.newValue as Locale)) {
				setLocaleState(e.newValue as Locale);
			}
		};
		window.addEventListener('storage', onStorage);
		return () => window.removeEventListener('storage', onStorage);
	}, []);

	return (
		<I18nContext.Provider value={{ locale, setLocale }}>
			<IntlProvider locale={locale} messages={messages[locale]}>
				{children}
			</IntlProvider>
		</I18nContext.Provider>
	);
};
