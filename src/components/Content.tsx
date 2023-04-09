import React, { useEffect, useRef, useState } from 'react';

import sendRequest from '../apis/openai';
import SettingDialog from './Settings/SettingDialog';
import Header from './Header';
import ConversationPanel from './ConversationPanel';
import ButtonGroup from './ButtonGroup';
import InputPanel from './InputPanel';
import AzureSpeechToText from './AzureSpeechToText';
import BrowserSpeechToText from './BrowserSpeechToText';

import {
  speechSynthesis,
  stopSpeechSynthesis,
  pauseSpeechSynthesis,
  resumeSpeechSynthesis,
} from '../utils/speechSynthesis';
import { useGlobalStore } from '../store/module';
import { existEnvironmentVariable, getEnvironmentVariable } from '../helpers/utils';

type baseStatus = 'idle' | 'waiting' | 'speaking' | 'recording' | 'connecting';

interface ContentProps {
  notify: any;
}

const Content: React.FC<ContentProps> = ({ notify }) => {
  const { key, chat, speech, voice } = useGlobalStore();

  const [sendMessages, setSendMessages] = useState<boolean>(false);
  const [conversations, setConversations] = useState<any[]>([]); // conversations to display

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
    stopSpeechSynthesis();
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
        region = existEnvironmentVariable('AWS_REGION')
          ? getEnvironmentVariable('AWS_REGION')
          : key.awsRegion;
        accessKeyId = existEnvironmentVariable('AWS_ACCESS_KEY_ID')
          ? getEnvironmentVariable('AWS_ACCESS_KEY_ID')
          : key.awsKeyId;
        secretAccessKey = existEnvironmentVariable('AWS_ACCESS_KEY')
          ? getEnvironmentVariable('AWS_ACCESS_KEY')
          : key.awsKey;
        break;
      case 'Azure TTS':
        language = speech.azureLanguage;
        voiceName = speech.azureVoice;
        region = existEnvironmentVariable('AZURE_REGION')
          ? getEnvironmentVariable('AZURE_REGION')
          : key.azureRegion;
        secretAccessKey = existEnvironmentVariable('AZURE_KEY')
          ? getEnvironmentVariable('AZURE_KEY')
          : key.azureKey;
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
      setConversations(prevConversations => [
        ...prevConversations,
        { role: 'assistant', content: response },
      ]);
      generateSpeech(response).then();
    }
  }, [response]);

  useEffect(() => {
    if (conversations.length > 0) {
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

      const openaiApiKey = existEnvironmentVariable('OPENAI_API_KEY')
        ? getEnvironmentVariable('OPENAI_API_KEY')
        : key.openaiApiKey;
      const openaiApiHost = existEnvironmentVariable('OPENAI_HOST')
        ? getEnvironmentVariable('OPENAI_HOST')
        : key.openaiHost;

      sendRequest(conversationsToSent, openaiApiKey, openaiApiHost, (data: any) => {
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
  }, [sendMessages]);

  const handleSend = async () => {
    if (input.length === 0 || status === 'waiting' || status === 'speaking') {
      return;
    }
    const input_json = { role: 'user', content: input };
    setSendMessages(!sendMessages);
    setConversations(prevConversations => [...prevConversations, input_json]);
    setInput('');
    focusInput();
  };

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const handleInputKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = async event => {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault(); // Prevents Enter key from submitting form
      if (input.length === 0) {
        return;
      } else {
        const input_json = { role: 'user', content: input };
        setSendMessages(!sendMessages);
        setConversations(prevConversations => [...prevConversations, input_json]);
        setInput('');
        focusInput();
      }
    } else if (event.keyCode === 13 && event.shiftKey) {
      event.preventDefault(); // Prevents Shift+Enter from creating a new line
      const cursorPosition = event.currentTarget.selectionStart;
      setInput(input.slice(0, cursorPosition) + '\n' + input.slice(cursorPosition));

      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.selectionStart = cursorPosition + 1;
          inputRef.current.selectionEnd = cursorPosition + 1;
          inputRef.current.scrollTop = inputRef.current.scrollHeight;
        }
      }, 0);
    }
  };

  const clearConversation = () => {
    setConversations([]);
    setInput(chat.defaultPrompt);
    setStatus('idle');
    stopSpeechSynthesis();
    notify.resetNotify();
  };

  function focusInput() {
    (inputRef.current as HTMLInputElement | null)?.focus();
    const length = (inputRef.current?.value || '').length;
    inputRef.current?.setSelectionRange(length, length);
  }

  function copyContentToClipboard(conversationContent: string) {
    navigator.clipboard.writeText(conversationContent);
    notify.copiedNotify();
  }

  function deleteContent(index: number) {
    setConversations(prevConversations => {
      const newConversations = [...prevConversations];
      newConversations.splice(index, 1);
      return newConversations;
    });
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
          subscriptionKey={
            existEnvironmentVariable('AZURE_KEY')
              ? getEnvironmentVariable('AZURE_KEY')
              : key.azureKey
          }
          region={
            existEnvironmentVariable('AZURE_REGION')
              ? getEnvironmentVariable('AZURE_REGION')
              : key.azureRegion
          }
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
          generateSpeech={generateSpeech}
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
