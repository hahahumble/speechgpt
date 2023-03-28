import React from 'react';
import Content from '../components/Content';
import { Toaster } from 'react-hot-toast';
import * as Notify from '../components/Notification';

function Home() {
  const notifyDict = {
    clearedNotify: Notify.clearedNotify,
    copiedNotify: Notify.copiedNotify,
    resetNotify: Notify.resetNotify,
    invalidOpenAiKeyNotify: Notify.invalidOpenAiKeyNotify,
    openAiErrorNotify: Notify.openAiErrorNotify,
    networkErrorNotify: Notify.networkErrorNotify,
    invalidOpenAiRequestNotify: Notify.emptyOpenAiKeyNotify,
    deletedNotify: Notify.deletedNotify,
    errorBuiltinSpeechRecognitionNotify: Notify.errorBuiltinSpeechRecognitionNotify,
    errorBuiltinSpeechSynthesisNotify: Notify.errorBuiltinSpeechSynthesisNotify,
    azureSynthesisErrorNotify: Notify.azureSynthesisErrorNotify,
    azureRecognitionErrorNotify: Notify.azureRecognitionErrorNotify,
    awsErrorNotify: Notify.awsErrorNotify,
    emptyAzureKeyNotify: Notify.emptyAzureKeyNotify,
  };

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
