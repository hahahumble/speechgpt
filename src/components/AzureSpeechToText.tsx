import React, { useState } from 'react';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import { existEnvironmentVariable, getEnvironmentVariable } from '../helpers/utils';

interface AzureSpeechToTextProps {
  subscriptionKey: string;
  region: string;
  isListening: boolean;
  language?: string;
  setTranscript: (update: ((prevTranscript: string) => string) | string) => void;
  setIsListening: (update: ((prevIsListening: boolean) => boolean) | boolean) => void;
  setWaiting: (update: ((prevWaiting: boolean) => boolean) | boolean) => void;
  notify: any;
  accessCode: string;
}

const AzureSpeechToText: React.FC<AzureSpeechToTextProps> = ({
  subscriptionKey,
  region,
  isListening,
  language = 'en-US',
  setIsListening,
  setTranscript,
  setWaiting,
  notify,
  accessCode,
}) => {
  const [recognizer, setRecognizer] = useState<sdk.SpeechRecognizer | null>(null);

  React.useEffect(() => {
    if (isListening) {
      startSpeechRecognition();
    } else {
      if (recognizer) {
        recognizer.stopContinuousRecognitionAsync();
      } else {
        // console.log('Recognizer is null');
      }
    }
  }, [isListening]);

  const startSpeechRecognition = () => {
    if (accessCode !== getEnvironmentVariable('ACCESS_CODE')) {
      notify.invalidAccessCodeNotify();
      setIsListening(false);
      setWaiting(false);
      return;
    }

    setWaiting(true);

    if (subscriptionKey === '' || region === '') {
      notify.emptyAzureKeyNotify();
      setIsListening(false);
      setWaiting(false);
      return;
    }

    const speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, region);
    speechConfig.speechRecognitionLanguage = language;

    const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
    const newRecognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    newRecognizer.recognizing = (s, e) => {
      console.log(`Recognizing: ${e.result.text}`);
    };

    newRecognizer.recognized = (s, e) => {
      console.log(`Recognized: ${e.result.text}`);
      if (e.result.text !== undefined) {
        setTranscript(e.result.text);
      }
    };

    newRecognizer.canceled = (s, e) => {
      // @ts-ignore
      if (e.errorCode === sdk.CancellationErrorCode.ErrorAPIKey) {
        console.error('Invalid or incorrect subscription key');
      } else {
        console.log(`Canceled: ${e.errorDetails}`);
        notify.azureRecognitionErrorNotify();
      }
      setIsListening(false);
      setWaiting(false);
    };

    newRecognizer.sessionStopped = (s, e) => {
      console.log('Session stopped');
      newRecognizer.stopContinuousRecognitionAsync();
      setIsListening(false);
      setWaiting(false);
    };

    newRecognizer.startContinuousRecognitionAsync(
      () => {
        setWaiting(false);
        console.log('Listening...');
      },
      error => {
        console.log(`Error: ${error}`);
        notify.azureRecognitionErrorNotify();
        newRecognizer.stopContinuousRecognitionAsync();
        setIsListening(false);
      }
    );

    setRecognizer(newRecognizer);
  };

  return null;
};

export default AzureSpeechToText;
