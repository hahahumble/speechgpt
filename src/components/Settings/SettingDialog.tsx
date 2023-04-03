import BaseDialog from '../base/Dialog';
import React, { useEffect, useState } from 'react';
import XIcon from '../Icons/XIcon';
import SettingSelector from './SettingSelector';
import TippyButton from '../base/TippyButton';
import SettingContent from './SettingContent';
import MobileSettingsSelector from '../MobileSettingsSelector';
import ChatIcon from '../Icons/ChatIcon';
import SpeakerIcon from '../Icons/SpeakerIcon';
import MicrophoneIcon from '../Icons/MicrophoneIcon';
import AboutIcon from '../Icons/AboutIcon';
import { useTranslation } from 'react-i18next';

interface SettingDialogProps {
  open: boolean;
  onClose: () => void;
}

function SettingDialog({ open, onClose }: SettingDialogProps) {
  const { i18n } = useTranslation();

  const [selected, setSelected] = useState<string>(i18n.t('setting.chat.title') as string);

  useEffect(() => {
    setSelected(i18n.t('setting.chat.title') as string);
  }, [i18n.t('setting.chat.title')]);

  const catalogItems = [
    i18n.t('setting.chat.title') as string,
    i18n.t('setting.synthesis.title') as string,
    i18n.t('setting.recognition.title') as string,
    i18n.t('setting.about.title') as string,
  ];

  const catalogIcons = [
    <ChatIcon className="w-5 h-5" />,
    <SpeakerIcon className="w-5 h-5" />,
    <MicrophoneIcon className="w-5 h-5" />,
    <AboutIcon className="w-5 h-5" />,
  ];

  return (
    <BaseDialog open={open} onClose={onClose}>
      <div className="absolute sm:top-5 sm:right-6 top-6 right-4">
        <TippyButton
          tooltip=""
          onClick={onClose}
          icon={<XIcon className="w-6 h-6 text-gray-500" />}
          style="hover:bg-gray-200 active:bg-gray-300"
        />
      </div>
      <div className="sm:h-96 h-150 flex sm:flex-row space-y-3 sm:space-y-0 flex-col sm:justify-center pt-5 sm:pt-0">
        <div className="relative block sm:hidden pl-4 sm:pl-0 w-fit">
          <MobileSettingsSelector
            catalogItems={catalogItems}
            selected={selected}
            setSelected={setSelected}
          />
        </div>
        <div className="bg-gray-100 w-60 py-6 hidden sm:block min-w-60">
          <SettingSelector
            selected={selected}
            onSelect={setSelected}
            catalogItems={catalogItems}
            catalogIcons={catalogIcons}
          />
        </div>
        <div className="w-full sm:pl-6 sm:pr-7 px-4">
          <SettingContent selected={selected} />
        </div>
      </div>
    </BaseDialog>
  );
}

export default SettingDialog;
