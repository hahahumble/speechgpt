import React from 'react';
import 'tippy.js/dist/tippy.css';
import SettingTextArea from './base/SettingTextArea';
import SettingDivider from './base/SettingDivider';
import SettingTitle from './base/SettingTitle';
import SettingInput from './base/SettingInput';
import SettingSwitch from './base/SettingSwitch';
import SettingSlider from './base/SettingSlider';
import SettingGroup from './base/SettingGroup';

import { useGlobalStore } from '../../store/module';
import { useTranslation } from 'react-i18next';

interface ChatSectionProps {}

const ChatSection: React.FC<ChatSectionProps> = ({}) => {
  const { key, setKey, chat, setChat } = useGlobalStore();

  const { i18n } = useTranslation();

  return (
    <div className="pb-5 flex flex-col space-y-2 overflow-y-scroll sm:py-6 sm:max-h-96 w-full max-h-[32rem]">
      <SettingTitle text={i18n.t('setting.chat.openai') as string} />
      <SettingInput
        text={i18n.t('setting.chat.openai-api-key') as string}
        id={'openai-api'}
        type={'text'}
        value={key.openaiApiKey}
        onChange={e => setKey({ ...key, openaiApiKey: e })}
        placeholder={i18n.t('setting.chat.api-key') as string}
        className={''}
      />

      <SettingDivider />
      <SettingTitle text={i18n.t('setting.chat.default-value') as string} />
      <SettingGroup>
        <SettingTextArea
          text={i18n.t('setting.chat.system-role') as string}
          helpText={i18n.t('setting.chat.system-role-tooltip') as string}
          className={''}
          value={chat.systemRole}
          onChange={e => setChat({ ...chat, systemRole: e })}
          placeholder={i18n.t('setting.chat.type-something') as string}
          maxRows={4}
        />
        <SettingTextArea
          text={i18n.t('setting.chat.default-prompt') as string}
          helpText={i18n.t('setting.chat.default-prompt-tooltip') as string}
          value={chat.defaultPrompt}
          onChange={e => setChat({ ...chat, defaultPrompt: e })}
          placeholder={i18n.t('setting.chat.type-something') as string}
          maxRows={4}
        />
      </SettingGroup>

      <SettingDivider />
      <SettingTitle text={i18n.t('setting.chat.others') as string} />
      <SettingGroup>
        <SettingSwitch
          text={i18n.t('setting.chat.use-assistant') as string}
          helpText={i18n.t('setting.chat.use-assistant-tooltip') as string}
          checked={chat.useAssistant}
          onChange={e => setChat({ ...chat, useAssistant: e })}
        />
        <SettingSlider
          text={i18n.t('setting.chat.temperature') as string}
          helpText={i18n.t('setting.chat.temperature-tooltip') as string}
          id={'temperature'}
          value={chat.temperature}
          onChange={e => setChat({ ...chat, temperature: e })}
          min={'0'}
          max={'2'}
          step={'0.1'}
        />
        <SettingSlider
          text={i18n.t('setting.chat.maximum-messages') as string}
          helpText={i18n.t('setting.chat.maximum-messages-tooltip') as string}
          id={'maximumMessages'}
          value={chat.maxMessages}
          onChange={e => setChat({ ...chat, maxMessages: e })}
          min={'1'}
          max={'100'}
          step={'1'}
        />
      </SettingGroup>
    </div>
  );
};

export default ChatSection;
