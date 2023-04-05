import React, { useEffect, useState } from 'react';
import SettingTitle from './base/SettingTitle';
import SettingDivider from './base/SettingDivider';
import SettingSelect from './base/SettingSelect';
import SettingGroup from './base/SettingGroup';
import SettingInput from './base/SettingInput';
import SettingSlider from './base/SettingSlider';
import SettingSwitch from './base/SettingSwitch';
import SettingCheckText from './base/SettingCheckText';
import SettingWarningText from './base/SettingWarningText';

import {
  awsRegions,
  azureRegions,
  azureSpeechRecognitionLanguagesLocale,
  speechRecognitionSystemLanguagesLocale,
} from '../../constants/data';

import { browserName, isMobile } from 'react-device-detect';
import { useGlobalStore } from '../../store/module';
import { useTranslation } from 'react-i18next';
import { existEnvironmentVariable } from '../../helpers/utils';

interface RecognitionSectionProps {}

const RecognitionSection: React.FC<RecognitionSectionProps> = ({}) => {
  const { i18n } = useTranslation();
  const { key, setKey, voice, setVoice } = useGlobalStore();
  const voiceServices =
    browserName !== 'Chrome' || isMobile
      ? ['Azure Speech to Text']
      : ['System', 'Azure Speech to Text'];

  useEffect(() => {
    if (!key.azureRegion) {
      setKey({ ...key, azureRegion: azureRegions[0] });
    }
  }, [key.azureRegion]);

  useEffect(() => {
    if (!key.awsRegion) {
      setKey({ ...key, awsRegion: awsRegions[0] });
    }
  }, [key.awsRegion]);

  function getSystemLanguageCode(language: string) {
    return Object.keys(speechRecognitionSystemLanguagesLocale).find(
      key => speechRecognitionSystemLanguagesLocale[key] === language
    );
  }

  function getAzureLanguageCode(language: string) {
    return Object.keys(azureSpeechRecognitionLanguagesLocale).find(
      key => azureSpeechRecognitionLanguagesLocale[key] === language
    );
  }

  return (
    <div className="flex flex-col space-y-2 overflow-y-scroll sm:py-6 sm:max-h-96 w-full max-h-[32rem] pb-5">
      <SettingTitle text={i18n.t('setting.recognition.service') as string} />
      <SettingGroup>
        {browserName !== 'Chrome' && !isMobile && (
          <SettingWarningText
            text={i18n.t('setting.recognition.browser-not-supported') as string}
          />
        )}
        {isMobile && (
          <SettingWarningText text={i18n.t('setting.recognition.mobile-not-supported') as string} />
        )}
        <SettingSelect
          text={i18n.t('setting.recognition.recognition-service') as string}
          helpText={i18n.t('setting.recognition.recognition-service-tooltip') as string}
          options={voiceServices}
          value={voice.service}
          className="min-w-min pr-8"
          selectClassName={'flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0'}
          onChange={e => setVoice({ ...voice, service: e })}
        />
        {voice.service === 'Azure Speech to Text' && (
          <>
            {existEnvironmentVariable('AZURE_REGION') && existEnvironmentVariable('AZURE_KEY') ? (
              <SettingCheckText
                text={
                  i18n.t('setting.recognition.azure-already-set-environment-variable') as string
                }
              />
            ) : (
              <>
                <SettingSelect
                  text={i18n.t('setting.recognition.azure-region') as string}
                  options={azureRegions}
                  value={key.azureRegion}
                  className={'min-w-min pr-8'}
                  selectClassName={
                    'flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0'
                  }
                  onChange={e => setKey({ ...key, azureRegion: e })}
                />
                <SettingInput
                  text={i18n.t('setting.recognition.azure-access-key') as string}
                  id={'azure-access-key'}
                  type={'text'}
                  value={key.azureKey}
                  placeholder={i18n.t('setting.recognition.azure-access-key-placeholder') as string}
                  onChange={e => setKey({ ...key, azureKey: e })}
                />
              </>
            )}
          </>
        )}
      </SettingGroup>

      <SettingDivider />
      <SettingTitle text={i18n.t('setting.recognition.properties') as string} />
      <SettingGroup>
        {voice.service === 'System' && (
          <SettingSelect
            text={i18n.t('setting.recognition.language') as string}
            // systemLanguage
            className={'w-56 pr-8'}
            options={Object.values(speechRecognitionSystemLanguagesLocale)}
            value={speechRecognitionSystemLanguagesLocale[voice.systemLanguage]}
            onChange={e => setVoice({ ...voice, systemLanguage: getSystemLanguageCode(e) })}
          />
        )}
        {voice.service === 'Azure Speech to Text' && (
          <SettingSelect
            text={i18n.t('setting.recognition.language') as string}
            className={'w-56 pr-8'}
            // selectClassName={'flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0'}
            options={Object.values(azureSpeechRecognitionLanguagesLocale)}
            value={azureSpeechRecognitionLanguagesLocale[voice.azureLanguage]}
            onChange={e => setVoice({ ...voice, azureLanguage: getAzureLanguageCode(e) })}
          />
        )}
        <SettingSwitch
          text={i18n.t('setting.recognition.continuous') as string}
          helpText={i18n.t('setting.recognition.continuous-tooltip') as string}
          checked={voice.autoStart}
          onChange={e => setVoice({ ...voice, autoStart: e })}
        />
        {voice.autoStart && (
          <SettingSlider
            text={i18n.t('setting.recognition.start-time') as string}
            id={'start-time'}
            helpText={i18n.t('setting.recognition.start-time-tooltip') as string}
            value={voice.startTime}
            onChange={e => setVoice({ ...voice, startTime: e })}
            min={'0'}
            max={'5'}
            step={'0.2'}
          />
        )}
      </SettingGroup>
    </div>
  );
};

export default RecognitionSection;
