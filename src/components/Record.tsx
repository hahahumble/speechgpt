import useSpeechToText, { ResultType } from 'react-hook-speech-to-text';
import { useEffect } from 'react';

type baseStatus = 'idle' | 'waiting' | 'speaking' | 'recording';

interface RecordProps {
  setResults: (results: string) => void;
  setInterimResult: (interimResult: string) => void;
  recording: boolean;
  setRecording: (recording: boolean) => void;
  status: string;
  setStatus: (status: baseStatus) => void;
  language: string;
}

function Record({
  setResults,
  setInterimResult,
  recording,
  setRecording,
  status,
  setStatus,
  language,
}: RecordProps) {
  // https://github.com/Riley-Brown/react-speech-to-text
  const { error, interimResult, isRecording, results, startSpeechToText, stopSpeechToText } =
    useSpeechToText({
      continuous: true,
      useLegacyResults: false,
      speechRecognitionProperties: {
        lang: language,
      },
    }) as {
      error: string;
      interimResult: string | undefined;
      isRecording: boolean;
      results: ResultType[];
      setResults: import('react').Dispatch<import('react').SetStateAction<ResultType[]>>;
      startSpeechToText: () => Promise<void>;
      stopSpeechToText: () => void;
    };

  useEffect(() => {
    console.log('error', error);
  }, [error]);

  useEffect(() => {
    if (results.length > 0) {
      // console.log(results);
      setResults(results[results.length - 1].transcript);
      // setResults(results.map((result) => result.transcript).join(' '));
    }
  }, [results]);

  // useEffect(() => {
  //   if (interimResult) {
  //     console.log('interimResult', interimResult);
  //     // setInterimResult(interimResult);
  //   }
  // }, [interimResult]);

  useEffect(() => {
    if (interimResult) {
      console.log('interimResult', interimResult);
    }
  }, [interimResult]);

  // start recognition when the user clicks the record button
  useEffect(() => {
    if (recording) {
      console.log('start: startSpeechToText()');
      startSpeechToText();
    } else {
      console.log('stop');
      stopSpeechToText();
    }
  }, [recording]);

  useEffect(() => {
    if (!isRecording) {
      console.log('isrecording false');
      setRecording(false);
    }
  }, [isRecording]);

  useEffect(() => {
    if (status == 'speaking' || status == 'waiting') {
      console.log('stop');
      stopSpeechToText();
    }
  }, [status]);

  return null;
}

export default Record;
