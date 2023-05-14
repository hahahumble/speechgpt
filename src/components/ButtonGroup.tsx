import TippyButton from './base/TippyButton';
import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  IconVolume,
  IconVolume3,
  IconMicrophone,
  IconMicrophoneOff,
  IconMessages,
  IconRotateClockwise,
  IconPlayerPause,
  IconPlayerPlay,
  IconBackspace,
} from '@tabler/icons-react';

interface ButtonGroupProps {
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
          icon={<IconMicrophone className="w-6 h-6 text-slate-500 stroke-2" />}
          style="hover:bg-slate-200 active:bg-slate-300"
        />
      );
    } else {
      return (
        <TippyButton
          tooltip={i18n.t('common.enable-microphone') as string}
          onClick={onClickDisableMicrophone}
          icon={<IconMicrophoneOff className="w-6 h-6 text-slate-500" />}
          style="hover:bg-slate-200 active:bg-slate-300"
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
          icon={<IconVolume className="w-6 h-6 text-slate-500 stroke-2" />}
          style="hover:bg-slate-200 active:bg-slate-300"
        />
      );
    } else {
      return (
        <TippyButton
          tooltip={i18n.t('common.enable-speaker') as string}
          onClick={onClickDisableSpeaker}
          icon={<IconVolume3 className="w-6 h-6 text-slate-500 stroke-2" />}
          style="hover:bg-slate-200 active:bg-slate-300"
        />
      );
    }
  }

  return (
    <div className="flex flex-row justify-between py-1">
      <div className="flex flex-row space-x-1">
        <MicrophoneButton />
        <SpeakerButton />
      </div>
      <div className="flex flex-row space-x-1">
        {status === 'speaking' && !finished && (
          <TippyButton
            tooltip={i18n.t('common.pause-speaking') as string}
            onClick={stopSpeaking}
            icon={<IconPlayerPause className="w-6 h-6 text-slate-500" />}
            style="hover:bg-slate-200 active:bg-slate-300"
          />
        )}
        {status !== 'speaking' && !finished && (
          <TippyButton
            tooltip={i18n.t('common.resume-speaking') as string}
            onClick={stopSpeaking}
            icon={<IconPlayerPlay className="w-6 h-6 text-slate-500" />}
            style="hover:bg-slate-200 active:bg-slate-300"
          />
        )}
        <TippyButton
          tooltip={i18n.t('common.reset-conversation') as string}
          onClick={clearConversation}
          icon={<IconRotateClockwise className="w-6 h-6 text-slate-500" />}
          style="hover:bg-slate-200 active:bg-slate-300"
        />
        <TippyButton
          onClick={() => {
            clearUserInput();
            notify.clearedNotify();
          }}
          tooltip={i18n.t('common.clear-input') as string}
          icon={<IconBackspace className="w-6 h-6 text-slate-500" />}
          style="hover:bg-slate-200 active:bg-slate-300"
        />
      </div>
    </div>
  );
}

export default ButtonGroup;
