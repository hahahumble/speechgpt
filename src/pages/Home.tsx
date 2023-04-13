import React from 'react';
import Content from '../components/Content';
import { Toaster } from 'react-hot-toast';
import * as Notify from '../components/Notification';
import { browserName, isMobile } from 'react-device-detect';
import { useGlobalStore } from '../store/module';

function Home() {
  const { speech, setSpeech, voice, setVoice } = useGlobalStore();

  const notifyDict = {
    clearedNotify: Notify.clearedNotify,
    copiedNotify: Notify.copiedNotify,
    resetNotify: Notify.resetNotify,
    invalidOpenAiKeyNotify: Notify.invalidOpenAiKeyNotify,
    openAiErrorNotify: Notify.openAiErrorNotify,
    networkErrorNotify: Notify.networkErrorNotify,
    invalidOpenAiRequestNotify: Notify.invalidOpenAiKeyNotify,
    invalidOpenAiModelNotify: Notify.invalidOpenAiModelNotify,
    emptyOpenAiKeyNotify: Notify.emptyOpenAiKeyNotify,
    deletedNotify: Notify.deletedNotify,
    errorBuiltinSpeechRecognitionNotify: Notify.errorBuiltinSpeechRecognitionNotify,
    errorBuiltinSpeechSynthesisNotify: Notify.errorBuiltinSpeechSynthesisNotify,
    azureSynthesisErrorNotify: Notify.azureSynthesisErrorNotify,
    azureRecognitionErrorNotify: Notify.azureRecognitionErrorNotify,
    awsErrorNotify: Notify.awsErrorNotify,
    emptyAzureKeyNotify: Notify.emptyAzureKeyNotify,
  };

  if (isMobile || browserName !== 'Chrome') {
    if (voice.service === 'System') {
      setVoice({ ...voice, service: 'Azure Speech to Text' });
    }

    if (isMobile && speech.service === 'System') {
      setSpeech({ ...speech, service: 'Azure TTS' });
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Toaster />
      <div className="h-screen fixed bottom-0 left-0 w-full flex justify-center items-end min-h-screen px-3">
        <Content notify={notifyDict} />
      </div>
    </div>
  );
}

export default Home;
