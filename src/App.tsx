
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

function App() {

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">
          <FormattedMessage defaultMessage="Worklog" id="title" />
        </h1>
        <CurrentDate />
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <DarkModeSwitch />
          <SettingsButton />
          <SettingsModal />
          <HistoryModal />
          <HistoryButton />
        </div>
      </div>
      <div className="flex flex-wrap items-start gap-4 mb-4 p-6 bg-blue-100 rounded-lg shadow-md justify-center">
        <SessionStatus />

        <SessionControl />
      </div>

    </div>
  );
}

export default App;
