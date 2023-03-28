import React, { useEffect } from 'react';
import SettingSelect from './base/SettingSelect';

import {
  pollyStandardSupportedLanguages,
  pollyStandardVoices,
  pollyNeuralVoices,
  pollyNeuralSupportedLanguages,
} from '../../constants/data';
import { useGlobalStore } from '../../store/module';
import { useTranslation } from 'react-i18next';

const PollyVoice = () => {
  const { i18n } = useTranslation();

  const { speech, setSpeech } = useGlobalStore();

  const languageCode = speech.pollyLanguage;

  // when the language is changed, reset the voice to the default
  useEffect(() => {
    if (pollyStandardSupportedLanguages.includes(languageCode)) {
      setSpeech({
        ...speech,
        pollyVoice: pollyStandardVoices[languageCode][0],
      });
    } else if (pollyNeuralSupportedLanguages.includes(languageCode)) {
      setSpeech({ ...speech, pollyVoice: pollyNeuralVoices[languageCode][0] });
    }
  }, [languageCode]);

  switch (speech.pollyEngine) {
    case 'Standard':
      if (pollyStandardSupportedLanguages.includes(languageCode)) {
        return (
          <SettingSelect
            text={i18n.t('setting.synthesis.voice-id') as string}
            helpText={i18n.t('setting.synthesis.voice-id-tooltip') as string}
            options={pollyStandardVoices[languageCode]}
            value={speech.pollyVoice}
            className="min-w-min"
            onChange={e => setSpeech({ ...speech, pollyVoice: e })}
          />
        );
      } else {
        return (
          <div className="text-left text-gray-600">
            {i18n.t('setting.synthesis.polly-standard-not-supported') as string}
          </div>
        );
      }
    case 'Neural':
      if (pollyNeuralSupportedLanguages.includes(languageCode)) {
        return (
          <SettingSelect
            text={i18n.t('setting.synthesis.voice-id') as string}
            helpText={i18n.t('setting.synthesis.voice-id-tooltip') as string}
            options={pollyNeuralVoices[languageCode]}
            value={speech.pollyVoice}
            className="min-w-min"
            onChange={e => setSpeech({ ...speech, pollyVoice: e })}
          />
        );
      } else {
        return (
          <div className="text-left text-gray-600">
            {i18n.t('setting.synthesis.polly-neural-not-supported') as string}
          </div>
        );
      }
    default:
      return null;
  }
};

export default PollyVoice;
