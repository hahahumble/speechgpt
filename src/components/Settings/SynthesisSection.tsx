import React, { useEffect, useState } from 'react';
import SettingTitle from './base/SettingTitle';
import SettingDivider from './base/SettingDivider';
import SettingSelect from './base/SettingSelect';
import SettingGroup from './base/SettingGroup';
import SettingInput from './base/SettingInput';
import SettingSlider from './base/SettingSlider';
import SettingCheckText from './base/SettingCheckText';
import PollyVoice from './PollyVoice';
import AzureTtsVoice from './azureTtsVoice';
import SettingWarningText from './base/SettingWarningText';

import {
  amazonPollyEngines,
  amazonPollyLanguages,
  speechSynthesisSystemLanguages,
  awsRegions,
  azureRegions,
  azureSpeechSynthesisLanguagesLocale,
} from '../../constants/data';
import { useGlobalStore } from '../../store/module';
import { useTranslation } from 'react-i18next';
import { browserName, isMobile } from 'react-device-detect';
import { existEnvironmentVariable } from '../../helpers/utils';

interface SynthesisSectionProps {}

const SynthesisSection: React.FC<SynthesisSectionProps> = ({}) => {
  const { key, setKey, speech, setSpeech } = useGlobalStore();
  const { i18n } = useTranslation();

  const speechSynthesisServices = isMobile
    ? ['Azure TTS', 'Amazon Polly']
    : ['System', 'Azure TTS', 'Amazon Polly'];

  function getSystemLanguageCode(language: string) {
    return Object.keys(speechSynthesisSystemLanguages).find(
      key => speechSynthesisSystemLanguages[key] === language
    );
  }

  function getAmazonPollyLanguageCode(language: string) {
    return Object.keys(amazonPollyLanguages).find(key => amazonPollyLanguages[key] === language);
  }

  function getAzureTTSLanguageCode(language: string) {
    return Object.keys(azureSpeechSynthesisLanguagesLocale).find(
      key => azureSpeechSynthesisLanguagesLocale[key] === language
    );
  }

  const [systemLanguages, setSystemLanguages] = useState<string[]>([]);
  const [systemVoices, setSystemVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setSystemVoices(availableVoices);

      const uniqueLanguages = Array.from(
        new Set(availableVoices.map(voice => voice.lang.split('-')[0]))
      );
      setSystemLanguages(uniqueLanguages);
    };

    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    } else {
      alert('Your browser does not support the Web Speech API.');
    }

    loadVoices();
  }, []);

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

  const filteredVoices = systemVoices.filter(
    voice => voice.lang.split('-')[0] === speech.systemLanguage
  );

  return (
    <div className="flex flex-col space-y-2 overflow-y-scroll sm:py-6 sm:max-h-96 w-full max-h-[32rem] pb-5">
      <SettingTitle text={i18n.t('setting.synthesis.service') as string} />
      <SettingGroup>
        {isMobile && (
          <SettingWarningText text={i18n.t('setting.synthesis.mobile-not-supported') as string} />
        )}
        <SettingSelect
          text={i18n.t('setting.synthesis.synthesis-service') as string}
          helpText={i18n.t('setting.synthesis.synthesis-service-tooltip') as string}
          options={speechSynthesisServices}
          value={speech.service}
          selectClassName={'flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0'}
          onChange={e => setSpeech({ ...speech, service: e })}
        />
        {speech.service === 'Amazon Polly' && (
          <>
            {existEnvironmentVariable('AWS_REGION') &&
            existEnvironmentVariable('AWS_ACCESS_KEY_ID') &&
            existEnvironmentVariable('AWS_ACCESS_KEY') ? (
              <SettingCheckText
                text={i18n.t('setting.synthesis.polly-already-set-environment-variable') as string}
              />
            ) : (
              <>
                <SettingSelect
                  text={i18n.t('setting.synthesis.aws-region') as string}
                  options={awsRegions}
                  value={key.awsRegion}
                  selectClassName={
                    'flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0'
                  }
                  onChange={e => setKey({ ...key, awsRegion: e })}
                />
                <SettingInput
                  text={i18n.t('setting.synthesis.aws-access-key-id') as string}
                  id={'aws-access-key-id'}
                  type={'text'}
                  value={key.awsKeyId}
                  placeholder={i18n.t('setting.synthesis.aws-access-key-id-placeholder') as string}
                  onChange={e => setKey({ ...key, awsKeyId: e })}
                />
                <SettingInput
                  text={i18n.t('setting.synthesis.aws-secret-access-key') as string}
                  id={'aws-secret-access-key'}
                  type={'text'}
                  value={key.awsKey}
                  placeholder={
                    i18n.t('setting.synthesis.aws-secret-access-key-placeholder') as string
                  }
                  onChange={e => setKey({ ...key, awsKey: e })}
                />
              </>
            )}
          </>
        )}
        {speech.service === 'Azure TTS' && (
          <>
            {existEnvironmentVariable('AZURE_REGION') && existEnvironmentVariable('AZURE_KEY') ? (
              <SettingCheckText
                text={i18n.t('setting.synthesis.azure-already-set-environment-variable') as string}
              />
            ) : (
              <>
                <SettingSelect
                  text={i18n.t('setting.synthesis.azure-region') as string}
                  options={azureRegions}
                  value={key.azureRegion}
                  selectClassName={
                    'flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0'
                  }
                  onChange={e => setKey({ ...key, azureRegion: e })}
                />
                <SettingInput
                  text={i18n.t('setting.synthesis.azure-access-key') as string}
                  id={i18n.t('setting.synthesis.azure-access-key-placeholder') as string}
                  type={'text'}
                  value={key.azureKey}
                  placeholder={'Azure Access Key'}
                  onChange={e => setKey({ ...key, azureKey: e })}
                />
              </>
            )}
          </>
        )}
      </SettingGroup>

      {speech.service === 'System' && (
        <>
          <SettingDivider />
          <SettingTitle text={i18n.t('setting.synthesis.properties') as string} />
          <SettingGroup>
            <SettingSelect
              text={i18n.t('setting.synthesis.language') as string}
              options={systemLanguages.map(language => speechSynthesisSystemLanguages[language])}
              value={speechSynthesisSystemLanguages[speech.systemLanguage]}
              selectClassName={'flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0'}
              onChange={e =>
                setSpeech({
                  ...speech,
                  systemLanguage: getSystemLanguageCode(e),
                })
              }
            />
            <SettingSlider
              text={i18n.t('setting.synthesis.speech-rate') as string}
              id={'speech-rate'}
              value={speech.systemRate}
              onChange={e => setSpeech({ ...speech, systemRate: e })}
              min={'0.5'}
              max={'2'}
              step={'0.05'}
            />
            <SettingSlider
              text={i18n.t('setting.synthesis.pitch') as string}
              id={'pitch'}
              value={speech.systemPitch}
              onChange={e => setSpeech({ ...speech, systemPitch: e })}
              min={'0.5'}
              max={'2'}
              step={'0.05'}
            />
          </SettingGroup>

          <SettingDivider />
          <SettingTitle text={i18n.t('setting.synthesis.voice') as string} />
          <SettingGroup>
            <SettingSelect
              text={i18n.t('setting.synthesis.voice-id') as string}
              helpText={i18n.t('setting.synthesis.voice-id-tooltip') as string}
              options={filteredVoices.map(voice => voice.name)}
              value={speech.systemVoice}
              className="w-56 pr-8"
              selectClassName={'flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0'}
              onChange={e => setSpeech({ ...speech, systemVoice: e })}
            />
          </SettingGroup>
        </>
      )}

      {speech.service === 'Amazon Polly' && (
        <>
          <SettingDivider />
          <SettingTitle text={i18n.t('setting.synthesis.properties') as string} />
          <SettingGroup>
            <SettingSelect
              text={i18n.t('setting.synthesis.language') as string}
              className={'min-w-min pr-8'}
              options={Object.values(amazonPollyLanguages)}
              value={amazonPollyLanguages[speech.pollyLanguage]}
              onChange={e =>
                setSpeech({
                  ...speech,
                  pollyLanguage: getAmazonPollyLanguageCode(e),
                })
              }
            />
          </SettingGroup>

          <SettingDivider />
          <SettingTitle text={i18n.t('setting.synthesis.voice') as string} />
          <SettingGroup>
            <SettingSelect
              text={i18n.t('setting.synthesis.engine') as string}
              helpText={i18n.t('setting.synthesis.engine-tooltip') as string}
              options={Object.values(amazonPollyEngines)}
              value={speech.pollyEngine}
              className="min-w-min pr-8"
              onChange={e => setSpeech({ ...speech, pollyEngine: e })}
            />
            <PollyVoice />
          </SettingGroup>
        </>
      )}

      {speech.service === 'Azure TTS' && (
        <>
          <SettingDivider />
          <SettingTitle text={i18n.t('setting.synthesis.properties') as string} />
          <SettingGroup>
            <SettingSelect
              text={i18n.t('setting.synthesis.language') as string}
              className={'min-w-min pr-8 '}
              selectClassName={'flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0'}
              options={Object.values(azureSpeechSynthesisLanguagesLocale)}
              value={azureSpeechSynthesisLanguagesLocale[speech.azureLanguage]}
              onChange={e =>
                setSpeech({
                  ...speech,
                  azureLanguage: getAzureTTSLanguageCode(e),
                })
              }
            />
          </SettingGroup>

          <SettingDivider />
          <SettingTitle text={i18n.t('setting.synthesis.voice') as string} />
          <SettingGroup>
            <AzureTtsVoice />
          </SettingGroup>
        </>
      )}
    </div>
  );
};

export default SynthesisSection;
