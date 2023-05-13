import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseDialog from './base/Dialog';
import TippyButton from './base/TippyButton';

import { IconX, IconInfoCircle, IconWorldWww, IconBrandGithub } from '@tabler/icons-react';
import SettingGroup from './Settings/base/SettingGroup';
import { getVersion } from '../utils/version';

interface AboutDialogProps {
  open: boolean;
  onClose: () => void;
  notify: any;
}

function AboutDialog({ open, onClose, notify }: AboutDialogProps) {
  const { i18n } = useTranslation();

  return (
    <BaseDialog open={open} onClose={onClose} className="w-120">
      <div className="absolute sm:top-5 sm:right-6 top-6 right-4">
        <TippyButton
          tooltip=""
          onClick={onClose}
          icon={<IconX className="w-6 h-6 text-gray-500" />}
          style="hover:bg-gray-200 active:bg-gray-300"
        />
      </div>
      <div className="w-full flex flex-col justify-center space-y-3 pt-4 pb-4">
        <div className="w-full h-full px-6 py-4 flex flex-col">
          <div className="flex flex-row items-center space-x-2">
            <IconInfoCircle className="h-7 w-7 text-gray-700" />
            <div className="text-lg self-start text-gray-700 font-bold">
              {i18n.t('common.about')}
            </div>
          </div>

          <div className="text-left text-gray-700 font-medium text-lg pt-5">
            {i18n.t('setting.about.intro')}
          </div>
          <SettingGroup>
            <div className={'flex flex-col space-y-2 text-left ml-0.5 text-gray-600'}>
              <div>
                <div
                  dangerouslySetInnerHTML={{
                    __html: i18n.t('setting.about.about-text') as string,
                  }}
                ></div>
              </div>
            </div>
          </SettingGroup>

          <div className="text-left text-gray-700 font-medium text-lg pt-5">
            {i18n.t('setting.about.link') as string}
          </div>

          <SettingGroup>
            <div className={'text-left ml-0.5 text-gray-600'}>
              <IconWorldWww className="inline mr-1.5 w-5 h-5" />
              <a href="https://speechgpt.app" className="inline underline hover:text-indigo-600">
                Official Website
              </a>
              <br />
              <div className="mt-1">
                <IconBrandGithub className="inline mr-1.5 w-5 h-5" />
                <a
                  href="https://github.com/hahahumble/speechgpt"
                  className="inline underline hover:text-indigo-600"
                >
                  GitHub
                </a>
              </div>
            </div>
          </SettingGroup>

          <div className="text-left text-gray-700 font-medium text-lg pt-5">
            {i18n.t('setting.about.version') as string}
          </div>

          <SettingGroup>
            <div className={'flex space-y-2 text-left ml-0.5 text-gray-600'}>
              Version: {getVersion()}
            </div>
          </SettingGroup>
        </div>
      </div>
    </BaseDialog>
  );
}

export default AboutDialog;
