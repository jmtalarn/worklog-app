
import { FormattedMessage } from 'react-intl';
import CurrentDate from './components/CurrentDate';
import { DarkModeSwitch } from './components/DarkModeSwitch';
import { LanguageSelector } from './components/LanguageSelector';
import { SessionControl } from './components/SessionControl';
import SessionStatus from './components/SessionStatus';
import { SettingsButton } from './components/SettingsButton';
import { SettingsModal } from './components/SettingsModal';
import { HistoryButton } from './components/HistoryButton';
import { HistoryModal } from './components/HistoryModal';
import styles from './App.module.css';

function App() {

  return (
    <div className="">
      <header className={styles.header}>
        <h1 className={styles.title}>
          <FormattedMessage defaultMessage="Worklog" id="title" />
        </h1>
        <CurrentDate />
        <div className={styles['config-buttons']}>
          <LanguageSelector />
          <DarkModeSwitch />
          <SettingsButton />
          <SettingsModal />
          <HistoryModal />
          <HistoryButton />
        </div>
      </header>
      <div className={styles['session-controls']}>
        <SessionStatus />

        <SessionControl />
      </div>

    </div>
  );
}

export default App;
