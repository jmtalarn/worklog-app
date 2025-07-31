import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './store';
import { I18nProvider } from './i18n/i18n';
import { initApp } from './initApp';


const Root = () => {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <I18nProvider><App /></I18nProvider>
      </Provider>
    </React.StrictMode>
  );
};

initApp().then(() => { ReactDOM.createRoot(document.getElementById('root')!).render(<Root />) });
