import React, { useEffect, useMemo, useRef, useState } from 'react';

import sendRequest from '../apis/openai';
import Header from './Header';
import ConversationPanel from './ConversationPanel';
import ButtonGroup from './ButtonGroup';
import InputPanel from './InputPanel';
import AzureSpeechToText from './AzureSpeechToText';
import BrowserSpeechToText from './BrowserSpeechToText';

import {
  pauseSpeechSynthesis,
  resumeSpeechSynthesis,
  speechSynthesis,
  stopSpeechSynthesis,
} from '../utils/speechSynthesis';

import { chatDB } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useGlobalStore, useSessionStore } from '../store/module';
import { existEnvironmentVariable, getEnvironmentVariable } from '../helpers/utils';
import { isMobile } from 'react-device-detect';
import SpeechGPTIcon from './Icons/SpeechGPTIcon';
import LanguageSelector from './LocaleSelector';


type baseStatus = 'idle' | 'waiting' | 'speaking' | 'recording' | 'connecting';

interface ContentProps {
  notify: any;
}

const useIsMount = () => {
  const isMountRef = useRef(true);
  useEffect(() => {
    isMountRef.current = false;
  }, []);
  return isMountRef.current;
};

const Content: React.FC<ContentProps> = ({ notify }) => {
  const {
    key,
    chat,
    speech,
    voice,
    disableSpeaker,
    setDisableSpeaker,
    disableMicrophone,
    setDisableMicrophone,
  } = useGlobalStore();
  const { currentSessionId, sessions, addSession, setCurrentSessionId, setMessageCount } =
    useSessionStore();

  const [sendMessages, setSendMessages] = useState<boolean>(false);

  const chatList = useLiveQuery(() => chatDB.chat.toArray(), []);

  const conversations = useMemo(() => {
    return (
      chatList?.map(l => ({
        role: l.role,
        content: l.content,
        id: l.id,
        sessionId: l.sessionId,
      })) || []
    );
  }, [chatList]);

  const [input, setInput] = useState<string>('');
  const [response, setResponse] = useState<string>(''); // openai response

  const [openSetting, setOpenSetting] = useState<boolean>(false);

  const [status, setStatus] = useState<baseStatus>('idle');
  const prevStatusRef = useRef(status);

  const [finished, setFinished] = useState<boolean>(true); // audio finished playing

  // speech to text transcript
  const [transcript, setTranscript] = useState('');
  // speech to text listening status
  const [isListening, setIsListening] = useState(false);

  const isMount = useIsMount();

  useEffect(() => {
    if (isMount) {
    } else {
      if (conversations.length === 0) {
        setInput(chat.defaultPrompt);
      }
    }
  }, [conversations]);

  useEffect(() => {
    if (currentSessionId) {
      const count = conversations.filter(c => c.sessionId === currentSessionId).length;
      setMessageCount({
        id: currentSessionId,
        messageCount: count,
      });
    }
  }, [conversations.length]);

  const calculateMessageCount = () => {
    const count = conversations.filter(c => c.sessionId === currentSessionId).length;
    setMessageCount({
      id: currentSessionId,
      messageCount: count,
    });
  };

  const generateSpeech = async (text: string) => {
    if (disableSpeaker) {
      return;
    }
    if (existEnvironmentVariable('ACCESS_CODE')) {
      const accessCode = getEnvironmentVariable('ACCESS_CODE');
      if (accessCode !== key.accessCode) {
        notify.invalidAccessCodeNotify();
        return;
      }
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
      setSendMessages(false);
      chatDB.chat.add({ role: 'assistant', content: response, sessionId: currentSessionId });
      generateSpeech(response).then();
    }
  }, [response]);

  useEffect(() => {
    if (conversations.length > 0 && sendMessages) {
      setStatus('waiting');
      let conversationsToSent: any = conversations;
      if (!chat.useAssistant) {
        conversationsToSent = conversations.filter(
          conversation => conversation.role === 'user' || conversation.role === 'system'
        );
      }
      conversationsToSent = conversationsToSent.map((conversation: any) => {
        return { role: conversation.role, content: conversation.content };
      });
      conversationsToSent = conversationsToSent.slice(chat.maxMessages * -1);
      conversationsToSent.unshift({ role: 'system', content: chat.systemRole });
      console.log(conversationsToSent);
      const openaiApiKey = existEnvironmentVariable('OPENAI_API_KEY')
        ? getEnvironmentVariable('OPENAI_API_KEY')
        : key.openaiApiKey;
      const openaiApiHost = existEnvironmentVariable('OPENAI_HOST')
        ? getEnvironmentVariable('OPENAI_HOST')
        : key.openaiHost;
      const openaiApiModel = existEnvironmentVariable('OPENAI_MODEL')
        ? getEnvironmentVariable('OPENAI_MODEL')
        : key.openaiModel;

      if (existEnvironmentVariable('ACCESS_CODE')) {
        const accessCode = getEnvironmentVariable('ACCESS_CODE');
        if (accessCode !== key.accessCode) {
          notify.invalidAccessCodeNotify();
          setStatus('idle');
          return;
        }
      }

      sendRequest(
        conversationsToSent as any,
        openaiApiKey,
        openaiApiHost,
        openaiApiModel,
        (data: any) => {
          setStatus('idle');
          if (data) {
            if ('error' in data) {
              console.log(data.error.code);
              if (data.error.code === 'invalid_api_key') {
                notify.invalidOpenAiKeyNotify();
              } else if (data.error.code === 'model_not_found') {
                notify.invalidOpenAiModelNotify();
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
        }
      ).catch(err => {
        console.log(err);
        notify.networkErrorNotify();
        setStatus('idle');
      });
    }
  }, [conversations]);

  const handleSend = async () => {
    if (input.length === 0 || status === 'waiting' || status === 'speaking') {
      return;
    }
    console.log('点击发送了！')
    const input_json = {
      role: 'user',
      content: input,
      sessionId: currentSessionId,
    };
    setSendMessages(true);
    chatDB.chat.add(input_json);

    setInput('');
    if (!isMobile) {
      focusInput();
    }
  };

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const handleInputKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = async event => {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault(); // Prevents Enter key from submitting form
      if (input.length === 0) {
        return;
      } else {
        const input_json = {
          role: 'user',
          content: input,
          sessionId: currentSessionId,
        };
        setSendMessages(true);
        chatDB.chat.add(input_json);

        setInput('');
        if (!isMobile) {
          focusInput();
        }
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

  const clearConversation = async () => {
    await chatDB.deleteChatsBySessionId(currentSessionId);
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

  function deleteContent(key: number) {
    chatDB.chat.delete(key);
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
    if (!isMobile) {
      focusInput();
    }
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
    if (!isMobile) {
      focusInput();
    }
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
    <div className="max-w-180 w-full flex flex-col h-full justify-between pb-3 dark:bg-gray-900">
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
          accessCode={
            existEnvironmentVariable('ACCESS_CODE') ? key.accessCode : 'REPLACE_WITH_YOUR_OWN'
          }
        />
      )}
      <div className="overflow-y-scroll h-full" ref={conversationRef}>
        <div className="flex flex-col sm:pt-16 sticky pt-16">
          <SpeechGPTIcon className="w-16 h-16 ml-2 sm:w-24 sm:h-24" />
          <div className="flex flex-row py-2 justify-between items-center w-full">
            <div className="text-2xl font-bold text-left text-gray-800">
              <span className="font-bold ml-2 decoration-purple-500 animate-text text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                NewTalk
              </span>
            </div>
            <div>
              <LanguageSelector />
              {/*<AppearanceSelector/>*/}
            </div>
          </div>
        </div>
        <div className='flex'>
        <ConversationPanel
          conversations={conversations}
          copyContentToClipboard={copyContentToClipboard}
          deleteContent={deleteContent}
          generateSpeech={generateSpeech}
        />
        <ConversationPanel
          conversations={conversations}
          copyContentToClipboard={copyContentToClipboard}
          deleteContent={deleteContent}
          generateSpeech={generateSpeech}
        />
        <br/>
        <div>answer:jn </div>
        </div>

      </div>
      <div className="">
        <ButtonGroup
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
