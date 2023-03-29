import React, { useEffect } from 'react';
import SettingSelect from './base/SettingSelect';

import { azureSpeechSynthesisVoices } from '../../constants/data';
import { useGlobalStore } from '../../store/module';
import { useTranslation } from 'react-i18next';

const azureTtsVoice = () => {
  const { i18n } = useTranslation();

  const { speech, setSpeech } = useGlobalStore();

  const languageCode = speech.azureLanguage;

  useEffect(() => {
    if (!azureSpeechSynthesisVoices[languageCode].includes(speech.azureVoice)) {
      setSpeech({
        ...speech,
        azureVoice: azureSpeechSynthesisVoices[languageCode][0],
      });
    }
  }, [languageCode]);

  return (
    <SettingSelect
      text={i18n.t('setting.synthesis.voice-id') as string}
      helpText={i18n.t('setting.synthesis.voice-id-tooltip') as string}
      options={azureSpeechSynthesisVoices[languageCode]}
      value={speech.azureVoice}
      className="min-w-min"
      selectClassName={'flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0'}
      onChange={e => setSpeech({ ...speech, azureVoice: e })}
    />
  );
};

export default azureTtsVoice;
