import React, { useEffect, useRef, useState, useMemo } from 'react';

import sendRequest from '../apis/openai';
import SettingDialog from './Settings/SettingDialog';

import Header from './Header';
import ConversationPanel from './ConversationPanel';
import ButtonGroup from './ButtonGroup';
import InputPanel from './InputPanel';
import { useGlobalStore } from '../store/module';

import {
  speechSynthesis,
  stopSpeechSynthesis,
  pauseSpeechSynthesis,
  resumeSpeechSynthesis,
} from '../utils/speechSynthesis';

import AzureSpeechToText from './AzureSpeechToText';
import BrowserSpeechToText from './BrowserSpeechToText';
//add live indedDb
import { db } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';

type baseStatus = 'idle' | 'waiting' | 'speaking' | 'recording' | 'connecting';

interface ContentProps {
  notify: any;
}

const Content: React.FC<ContentProps> = ({ notify }) => {
  const { key, chat, speech, voice } = useGlobalStore();

  const [sendMessages, setSendMessages] = useState<boolean>(false);
  const list = useLiveQuery(() => db.chat.toArray(), []);
  const conversations = useMemo(() => {
    return list?.map(l => ({ role: l.role, content: l.content })) || [];
  }, [list]);
  const [input, setInput] = useState<string>(chat.defaultPrompt);
  const [response, setResponse] = useState<string>(''); // openai response

  const [openSetting, setOpenSetting] = useState<boolean>(false);

  const [status, setStatus] = useState<baseStatus>('idle');
  const prevStatusRef = useRef(status);

  const [finished, setFinished] = useState<boolean>(true); // audio finished playing

  const [disableSpeaker, setDisableSpeaker] = useState<boolean>(false);
  const [disableMicrophone, setDisableMicrophone] = useState<boolean>(false);

  // speech to text transcript
  const [transcript, setTranscript] = useState('');
  // speech to text listening status
  const [isListening, setIsListening] = useState(false);

  const generateSpeech = async (text: string) => {
    if (disableSpeaker) {
      return;
    }
    setStatus('speaking');
    setFinished(false);

    let language: string = '';
    let voiceName: string = '';
    let rate: number = 1;
    let pitch: number = 1;
    let region: string = '';
    let accessKeyId: string = '';
    let secretAccessKey: string = '';

    switch (speech.service) {
      case 'System':
        language = speech.systemLanguage;
        voiceName = speech.systemVoice;
        rate = speech.systemRate;
        pitch = speech.systemPitch;
        break;
      case 'Amazon Polly':
        language = speech.pollyLanguage;
        voiceName = speech.pollyVoice;
        region = key.awsRegion;
        accessKeyId = key.awsKeyId;
        secretAccessKey = key.awsKey;
        break;
      case 'Azure TTS':
        language = speech.azureLanguage;
        voiceName = speech.azureVoice;
        region = key.azureRegion;
        secretAccessKey = key.azureKey;
        break;
    }

    speechSynthesis({
      text: text,
      service: speech.service,
      language: language,
      rate: rate,
      pitch: pitch,
      voiceName: voiceName,
      engine: speech.pollyEngine,
      region: region,
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      notify: notify,
    })
      .then(() => {
        console.log('Audio finished playing');
        setStatus('idle');
        setFinished(true);
      })
      .catch(error => {
        if (error.error === 'interrupted') {
          console.log('Speech synthesis interrupted');
        } else {
          console.error('An error occurred during speech synthesis:', error);
        }
        setStatus('idle');
      });
  };

  useEffect(() => {
    if (transcript.length !== 0 && transcript !== 'undefined') {
      setInput(prevInput => prevInput + ' ' + transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (response.length !== 0 && response !== 'undefined') {
      setSendMessages(!sendMessages);

      db.chat.add({ role: 'assistant', content: response });
      generateSpeech(response).then();
    }
  }, [response]);

  useEffect(() => {
    if (conversations.length > 0 && sendMessages) {
      setStatus('waiting');
      let conversationsToSent = conversations;
      if (!chat.useAssistant) {
        // if `useAssistant` is false, remove assistant's conversation
        conversationsToSent = conversations.filter(
          conversation => conversation.role === 'user' || conversation.role === 'system'
        );
      }
      conversationsToSent = conversationsToSent.slice(chat.maxMessages * -1);
      conversationsToSent.unshift({ role: 'system', content: chat.systemRole });
      console.log(conversationsToSent);
      sendRequest(conversationsToSent as any, key.openaiApiKey, key.openaiHost, (data: any) => {
        setStatus('idle');
        if (data) {
          if ('error' in data) {
            if (data.error.code === 'invalid_api_key') {
              notify.invalidOpenAiKeyNotify();
            } else if (data.error.type === 'invalid_request_error') {
              notify.invalidOpenAiRequestNotify();
            } else {
              notify.openAiErrorNotify();
            }
          }
          setResponse(data.choices[0].message.content);
          console.log('Response: ' + data.choices[0].message.content);
          setStatus('idle');
        }
      }).catch(err => {
        console.log(err);
        notify.networkErrorNotify();
        setStatus('idle');
      });
    }
  }, [sendMessages, conversations]);

  const handleSend = async () => {
    if (input.length === 0 || status === 'waiting' || status === 'speaking') {
      return;
    }
    const input_json = { role: 'user', content: input };
    setSendMessages(!sendMessages);
    db.chat.add(input_json);
    setInput('');
    focusInput();
  };

  const handleInputKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = async event => {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault(); // Prevents Enter key from submitting form
      if (input.length === 0) {
        return;
      } else {
        const input_json = { role: 'user', content: input };
        setSendMessages(!sendMessages);
        db.chat.add(input_json);

        setInput('');
        focusInput();
      }
      // Handle form submission here
    } else if (event.keyCode === 13 && event.shiftKey) {
      event.preventDefault(); // Prevents Shift+Enter from creating a new line
      setInput(input + '\n');
    }
  };

  const clearConversation = () => {
    db.chat.clear();
    setInput(chat.defaultPrompt);
    setStatus('idle');
    stopSpeechSynthesis();
    notify.resetNotify();
  };

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  function focusInput() {
    (inputRef.current as HTMLInputElement | null)?.focus();
    const length = (inputRef.current?.value || '').length;
    inputRef.current?.setSelectionRange(length, length);
  }

  function copyContentToClipboard(conversationContent: string) {
    navigator.clipboard.writeText(conversationContent);
    notify.copiedNotify();
  }

  function deleteContent(key: number) {
    db.chat.delete(key);
    notify.deletedNotify();
  }

  function onClickDisableSpeaker() {
    setDisableSpeaker(!disableSpeaker);
  }

  function onClickDisableMicrophone() {
    setDisableMicrophone(!disableMicrophone);
  }

  const conversationRef = useRef(null);
  const previousConversationsLengthRef = useRef<number>(0);

  useEffect(() => {
    if (conversationRef.current && previousConversationsLengthRef.current < conversations.length) {
      (conversationRef.current as HTMLDivElement).scrollTop = (
        conversationRef.current as HTMLDivElement
      ).scrollHeight;
    }
    previousConversationsLengthRef.current = conversations.length;
  }, [conversations]);

  useEffect(() => {
    if (disableMicrophone) {
      if (status === 'recording') {
        setStatus('idle');
      }
    }
  }, [disableMicrophone]);

  useEffect(() => {
    if (disableSpeaker) {
      if (status === 'speaking') {
        setStatus('idle');
        stopSpeechSynthesis();
      }
    }
  }, [disableSpeaker]);

  function clearInput() {
    setInput('');
    focusInput();
  }

  function pauseSpeaking() {
    if (!finished) {
      // not finish
      if (status === 'speaking') {
        pauseSpeechSynthesis();
        setStatus('idle');
      } else if (status === 'idle') {
        resumeSpeechSynthesis();
        setStatus('speaking');
      }
    } else {
      if (status === 'speaking') {
        stopSpeechSynthesis();
        setStatus('idle');
      }
    }
  }

  function startRecording() {
    setStatus('recording');
    focusInput();
  }

  function stopRecording() {
    setStatus('idle');
  }

  useEffect(() => {
    if (voice.autoStart && !disableMicrophone) {
      const prevStatus = prevStatusRef.current;
      if (prevStatus === 'speaking' && status === 'idle' && conversations.length > 0) {
        setTimeout(() => {
          startRecording();
        }, voice.startTime * 1000);
      }
      prevStatusRef.current = status;
    }
  }, [status]);

  const [waiting, setWaiting] = React.useState(false);

  React.useEffect(() => {
    if (status === 'recording') {
      setIsListening(true);
    } else {
      setIsListening(false);
    }
  }, [status]);

  React.useEffect(() => {
    if (status === 'recording' && !isListening) {
      stopRecording();
    }
  }, [isListening]);

  return (
    <div className="w-160 flex flex-col h-full justify-between pb-3 dark:bg-gray-900">
      <SettingDialog open={openSetting} onClose={() => setOpenSetting(false)} />
      {voice.service == 'System' && (
        <BrowserSpeechToText
          isListening={isListening}
          language={voice.systemLanguage}
          setIsListening={setIsListening}
          setTranscript={setTranscript}
          notify={notify}
        />
      )}
      {voice.service == 'Azure Speech to Text' && (
        <AzureSpeechToText
          subscriptionKey={key.azureKey}
          region={key.azureRegion}
          language={voice.azureLanguage}
          isListening={isListening}
          setIsListening={setIsListening}
          setTranscript={setTranscript}
          setWaiting={setWaiting}
          notify={notify}
        />
      )}
      <div className="overflow-y-scroll h-full" ref={conversationRef}>
        <Header />
        <ConversationPanel
          conversations={conversations}
          copyContentToClipboard={copyContentToClipboard}
          deleteContent={deleteContent}
        />
      </div>
      <div className="">
        <ButtonGroup
          setOpenSetting={setOpenSetting}
          disableMicrophone={disableMicrophone}
          disableSpeaker={disableSpeaker}
          onClickDisableMicrophone={onClickDisableMicrophone}
          onClickDisableSpeaker={onClickDisableSpeaker}
          stopSpeaking={pauseSpeaking}
          clearConversation={clearConversation}
          clearUserInput={clearInput}
          notify={notify}
          status={status}
          finished={finished}
        />
        <InputPanel
          status={status}
          disableMicrophone={disableMicrophone}
          userInput={input}
          setUserInput={setInput}
          startRecording={startRecording}
          stopRecording={stopRecording}
          handleSend={handleSend}
          inputRef={inputRef}
          handleInputKeyDown={handleInputKeyDown}
          waiting={waiting}
          notify={notify}
        />
      </div>
    </div>
  );
};

export default Content;
