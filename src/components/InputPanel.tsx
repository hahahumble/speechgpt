import TextareaAutosize from 'react-textarea-autosize';
import React from 'react';
import SendIcon from './Icons/SendIcon';
import WaitingIcon from './Icons/WaitingIcon';
import StartCircleIcon from './Icons/StartCircleIcon';
import StopCircleIcon from './Icons/StopCircleIcon';
import { useTranslation } from 'react-i18next';
import SpinnerIcon from './Icons/SpinnerIcon';

interface InputPanelProps {
  status: string;
  disableMicrophone: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  handleSend: () => void;
  inputRef: React.RefObject<HTMLTextAreaElement>;
  userInput: string;
  setUserInput: (value: string) => void;
  handleInputKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  waiting: boolean;
  notify: any;
}

function InputPanel({
  status,
  disableMicrophone,
  startRecording,
  stopRecording,
  handleSend,
  inputRef,
  userInput,
  setUserInput,
  handleInputKeyDown,
  waiting,
  notify,
}: InputPanelProps) {
  const { i18n } = useTranslation();

  function RecordButton() {
    if (status === 'idle' && !disableMicrophone) {
      return (
        <button
          type="button"
          className="flex flex-row items-center space-x-2 rounded-lg px-4 py-2 font-medium text-white bg-gradient-to-l from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 active:from-orange-800 active:to-red-800 transition-colors duration-300"
          onClick={startRecording}
        >
          <StartCircleIcon className="h-5 w-5" />
          <div>{i18n.t('common.record')}</div>
        </button>
      );
    } else if (status === 'speaking' || status === 'waiting' || disableMicrophone) {
      return (
        <button
          type="button"
          className="cursor-no-drop flex flex-row items-center space-x-2 rounded-lg px-4 py-2 font-medium text-white bg-gradient-to-l from-orange-600 to-red-600"
        >
          <StartCircleIcon className="h-5 w-5" />
          <div>{i18n.t('common.record')}</div>
        </button>
      );
    } else if (status === 'recording' && !disableMicrophone && waiting) {
      return (
        <button
          type="button"
          className="relative flex flex-row items-center space-x-2 rounded-lg px-4 py-2 font-medium text-white bg-gradient-to-l from-gray-500 to-slate-600 hover:cursor-wait"
        >
          <SpinnerIcon className="h-5 w-5 animate-spin " />
          <div>{i18n.t('common.connecting')}</div>
        </button>
      );
    } else if (status === 'recording' && !disableMicrophone && !waiting) {
      return (
        <button
          type="button"
          className="relative flex flex-row items-center space-x-2 rounded-lg px-4 py-2 font-medium text-white bg-gradient-to-l from-gray-500 to-slate-600 hover:from-gray-600 hover:to-slate-700 active:from-gray-700 active:to-slate-800 transition-colors duration-300"
          onClick={stopRecording}
        >
          <StopCircleIcon className="h-5 w-5" />
          <div>{i18n.t('common.stop')}</div>
        </button>
      );
    } else {
      return (
        <button
          type="button"
          className="cursor-wait flex flex-row items-center space-x-2 rounded-lg px-4 py-2 font-medium text-white bg-gradient-to-l from-orange-600 to-red-600"
        >
          <StartCircleIcon className="h-5 w-5" />
          <div>{i18n.t('common.record')}</div>
        </button>
      );
    }
  }

  function SendButton() {
    if (status === 'idle' || status === 'recording' || status === 'connecting') {
      return (
        <button
          type="button"
          className="flex flex-row items-center space-x-2 rounded-lg px-4 py-2 font-medium text-white bg-gradient-to-tr from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-700 active:from-indigo-700 active:to-purple-800 transition-colors duration-300"
          onClick={handleSend}
        >
          <SendIcon className="h-5 w-5" />
          <div>{i18n.t('common.send')}</div>
        </button>
      );
    } else {
      return (
        <button
          type="button"
          className="flex flex-row items-center space-x-2 cursor-wait rounded-lg px-4 py-2 font-medium text-white bg-gradient-to-tr from-indigo-500 to-purple-500 transition-colors duration-300"
          onClick={handleSend}
        >
          <SpinnerIcon className="h-5 w-5 animate-spin " />
          <div>{i18n.t('common.waiting')}</div>
        </button>
      );
    }
  }

  return (
    <div className="flex flex-col space-y-2">
      <TextareaAutosize
        id={'input'}
        ref={inputRef}
        placeholder="Type your message"
        className="bg-gray-200 rounded-lg px-4 py-2 w-full border-none focus:ring-0 focus:outline-none resize-none"
        value={userInput}
        onChange={event => setUserInput(event.target.value)}
        onKeyDown={handleInputKeyDown}
        maxRows={5}
      />
      <div className="flex flex-row space-x-2 justify-end">
        {/*<div className="self-end text-gray-700">{i18n.t('common.status')}: {status}</div>*/}
        <RecordButton />
        <SendButton />
      </div>
    </div>
  );
}

export default InputPanel;
