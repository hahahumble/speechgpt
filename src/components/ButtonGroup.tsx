import TippyButton from './base/TippyButton';
import React, { useRef, useState } from 'react';
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
  IconCheck,
} from '@tabler/icons-react';
import { useGlobalStore } from '../store/module';
import { isMobile } from 'react-device-detect';

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
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

  const resetTimeoutRef = useRef<number | null>(null);

  function handleResetClick() {
    if (!isConfirmingReset) {
      setIsConfirmingReset(true);

      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }

      resetTimeoutRef.current = setTimeout(() => {
        setIsConfirmingReset(false);
      }, 6000);
    } else {
      clearConversation();
      setIsConfirmingReset(false);

      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    }
  }

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
        {!disableSpeaker && (
          <>
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
          </>
        )}
        {isConfirmingReset ? (
          <TippyButton
            tooltip={i18n.t('common.confirm') as string}
            onClick={handleResetClick}
            icon={<IconCheck className="w-6 h-6 text-slate-500" />}
            style="hover:bg-slate-200 active:bg-slate-300"
          />
        ) : (
          <TippyButton
            tooltip={i18n.t('common.reset-conversation') as string}
            onClick={handleResetClick}
            icon={<IconRotateClockwise className="w-6 h-6 text-slate-500" />}
            style="hover:bg-slate-200 active:bg-slate-300"
          />
        )}
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
