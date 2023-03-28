import TippyButton from './base/TippyButton';
import SettingIcon from './Icons/SettingIcon';
import PauseIcon from './Icons/PauseIcon';
import ResetIcon from './Icons/ResetIcon';
import TrashIcon from './Icons/TrashIcon';
import React from 'react';
import MicrophoneIcon from './Icons/MicrophoneIcon';
import MuteMicrophoneIcon from './Icons/MuteMicrophoneIcon';
import SpeakerIcon from './Icons/SpeakerIcon';
import MuteSpeakerIcon from './Icons/MuteSpeakerIcon';
import PlayIcon from './Icons/PlayIcon';
import { useTranslation } from 'react-i18next';

interface ButtonGroupProps {
  setOpenSetting: (open: boolean) => void;
  disableMicrophone: boolean;
  onClickDisableMicrophone: () => void;
  disableSpeaker: boolean;
  onClickDisableSpeaker: () => void;
  stopSpeaking: () => void;
  clearConversation: () => void;
  clearUserInput: () => void;
  notify: any;
  status: string;
  finished: boolean;
}

function ButtonGroup({
  setOpenSetting,
  disableMicrophone,
  onClickDisableMicrophone,
  disableSpeaker,
  onClickDisableSpeaker,
  stopSpeaking,
  clearConversation,
  clearUserInput,
  notify,
  status,
  finished,
}: ButtonGroupProps) {
  const { i18n } = useTranslation();

  function MicrophoneButton() {
    if (!disableMicrophone) {
      return (
        <TippyButton
          tooltip={i18n.t('common.disable-microphone') as string}
          onClick={onClickDisableMicrophone}
          icon={<MicrophoneIcon className="w-6 h-6 text-gray-500" />}
          style="hover:bg-gray-200 active:bg-gray-300"
        />
      );
    } else {
      return (
        <TippyButton
          tooltip={i18n.t('common.enable-microphone') as string}
          onClick={onClickDisableMicrophone}
          icon={<MuteMicrophoneIcon className="w-6 h-6 text-gray-500" />}
          style="hover:bg-gray-200 active:bg-gray-300"
        />
      );
    }
  }

  function SpeakerButton() {
    if (!disableSpeaker) {
      return (
        <TippyButton
          tooltip={i18n.t('common.disable-speaker') as string}
          onClick={onClickDisableSpeaker}
          icon={<SpeakerIcon className="w-6 h-6 text-gray-500" />}
          style="hover:bg-gray-200 active:bg-gray-300"
        />
      );
    } else {
      return (
        <TippyButton
          tooltip={i18n.t('common.enable-speaker') as string}
          onClick={onClickDisableSpeaker}
          icon={<MuteSpeakerIcon className="w-6 h-6 text-gray-500" />}
          style="hover:bg-gray-200 active:bg-gray-300"
        />
      );
    }
  }

  return (
    <div className="flex flex-row justify-between py-1">
      <div className="flex flex-row space-x-1">
        <TippyButton
          tooltip={i18n.t('common.setting') as string}
          onClick={() => setOpenSetting(true)}
          icon={<SettingIcon className="w-6 h-6 text-gray-500" />}
          style="hover:bg-gray-200 active:bg-gray-300"
        />
        <MicrophoneButton />
        <SpeakerButton />
      </div>
      <div className="flex flex-row space-x-1">
        {status === 'speaking' && !finished && (
          <TippyButton
            tooltip={i18n.t('common.pause-speaking') as string}
            onClick={stopSpeaking}
            icon={<PauseIcon className="w-6 h-6 text-gray-500" />}
            style="hover:bg-gray-200 active:bg-gray-300"
          />
        )}
        {status !== 'speaking' && !finished && (
          <TippyButton
            tooltip={i18n.t('common.resume-speaking') as string}
            onClick={stopSpeaking}
            icon={<PlayIcon className="w-6 h-6 text-gray-500" />}
            style="hover:bg-gray-200 active:bg-gray-300"
          />
        )}
        <TippyButton
          tooltip={i18n.t('common.reset-conversation') as string}
          onClick={clearConversation}
          icon={<ResetIcon className="w-6 h-6 text-gray-500" />}
          style="hover:bg-gray-200 active:bg-gray-300"
        />
        <TippyButton
          onClick={() => {
            clearUserInput();
            notify.clearedNotify();
          }}
          tooltip={i18n.t('common.clear-input') as string}
          icon={<TrashIcon className="w-6 h-6 text-gray-500" />}
          style="hover:bg-gray-200 active:bg-gray-300"
        />
      </div>
    </div>
  );
}

export default ButtonGroup;
