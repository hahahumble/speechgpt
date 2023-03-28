import React, { useState, useEffect } from 'react';
import {} from './Notification';

interface BrowserSpeechToTextProps {
  isListening: boolean;
  language: string;
  setIsListening: (update: ((prevIsListening: boolean) => boolean) | boolean) => void;
  setTranscript: (update: ((prevTranscript: string) => string) | string) => void;
  notify: any;
}

const BrowserSpeechToText: React.FC<BrowserSpeechToTextProps> = ({
  isListening,
  language,
  setIsListening,
  setTranscript,
  notify,
}) => {
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognizer = new SpeechRecognition();

      recognizer.interimResults = true;
      recognizer.continuous = true;
      recognizer.lang = language;

      recognizer.onresult = (event: SpeechRecognitionEvent) => {
        let currentTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const text = result[0].transcript;

          if (result.isFinal) {
            // setTranscript((prevTranscript: string) => prevTranscript + ' ' + text);
            setTranscript(text);
          } else {
            currentTranscript += text;
          }
        }
        // console.log('Current Transcript:', currentTranscript);
      };

      // @ts-ignore
      recognizer.onerror = (event: SpeechRecognitionError) => {
        console.log('Error:', event.error);
        notify.errorBuiltinSpeechRecognitionNotify();
        // onToggleListening();
        setIsListening(false);
      };

      setRecognition(recognizer);
    } else {
      console.log('SpeechRecognition API is not supported in this browser');
      notify.errorBuiltinSpeechRecognitionNotify();
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isListening, language]);

  useEffect(() => {
    if (isListening) {
      if (recognition) {
        recognition.start();
      }
    } else {
      if (recognition) {
        recognition.stop();
      }
    }
  }, [isListening, recognition]);

  return null;
};

export default BrowserSpeechToText;
