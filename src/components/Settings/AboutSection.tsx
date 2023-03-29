import React, { useEffect, useState } from 'react';
import 'tippy.js/dist/tippy.css';
import SettingTitle from './base/SettingTitle';
import SettingDivider from './base/SettingDivider';
import SettingSelect from './base/SettingSelect';
import SettingGroup from './base/SettingGroup';
import SettingInput from './base/SettingInput';
import SettingSlider from './base/SettingSlider';
import SettingSwitch from './base/SettingSwitch';
import { useTranslation } from 'react-i18next';

interface AboutSectionProps {}

const AboutSection: React.FC<AboutSectionProps> = ({}) => {
  const { i18n } = useTranslation();

  return (
    <div className="flex flex-col space-y-2 overflow-y-scroll sm:py-6 sm:max-h-96 w-full max-h-[32rem] pb-5">
      <SettingTitle text={i18n.t('setting.about.title') as string} />
      <SettingGroup>
        <div className={'flex flex-col space-y-2 text-left ml-0.5 text-gray-700'}>
          <div>
            <div
              dangerouslySetInnerHTML={{
                __html: i18n.t('setting.about.about-text') as string,
              }}
            ></div>
          </div>
        </div>
      </SettingGroup>

      <SettingDivider />
      <SettingTitle text={i18n.t('setting.about.link') as string} />
      <SettingGroup>
        <div className={' text-left ml-0.5 text-gray-700'}>
          Website:{' '}
          <a href="https://speechgpt.app" className="inline underline hover:text-indigo-600">
            https://speechgpt.app
          </a>
          <br />
          Github:{' '}
          <a
            href="https://github.com/hahahumble/speechgpt"
            className="inline underline hover:text-indigo-600"
          >
            https://github.com/hahahumble/speechgpt
          </a>
        </div>
      </SettingGroup>

      <SettingDivider />
      <SettingTitle text={i18n.t('setting.about.version') as string} />
      <SettingGroup>
        <div className={'flex space-y-2 text-left ml-0.5 text-gray-700'}>Version: v0.1.0</div>
      </SettingGroup>
    </div>
  );
};

export default AboutSection;
