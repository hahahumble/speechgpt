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
import WebsiteIcon from '../Icons/WebsiteIcon';
import GitHubIcon from '../Icons/GitHubIcon';
import FeedbackIcon from '../Icons/FeedbackIcon';
import OpenLinkIcon from '../Icons/OpenLinkIcon';

interface AboutSectionProps {}

const AboutSection: React.FC<AboutSectionProps> = ({}) => {
  const { i18n } = useTranslation();

  return (
    <div className="flex flex-col space-y-2 overflow-y-scroll sm:py-6 sm:max-h-96 w-full max-h-[32rem] pb-5">
      <SettingTitle text={i18n.t('setting.about.title') as string} />
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

      <SettingDivider />
      <SettingTitle text={i18n.t('setting.about.link') as string} />
      <SettingGroup>
        <div className={'text-left ml-0.5 text-gray-600'}>
          <WebsiteIcon className="inline mr-1.5 w-5 h-5" />
          <a href="https://speechgpt.app" className="inline underline hover:text-indigo-600">
            Official Website
          </a>
          <OpenLinkIcon className="inline ml-1 w-5 h-5 mb-0.5 opacity-0 group-hover:opacity-100" />
          <br />
          <div className="mt-1">
            <GitHubIcon className="inline mr-1.5 w-5 h-5" />
            <a
              href="https://github.com/hahahumble/speechgpt"
              className="inline underline hover:text-indigo-600"
            >
              Github
            </a>
          </div>
          <div className="mt-1">
            <FeedbackIcon className="inline mr-1.5 w-5 h-5" />
            <a
              href="https://github.com/hahahumble/speechgpt/issues"
              className="inline underline hover:text-indigo-600"
            >
              Feedback
            </a>
          </div>
        </div>
      </SettingGroup>

      <SettingDivider />
      <SettingTitle text={i18n.t('setting.about.version') as string} />
      <SettingGroup>
        <div className={'flex space-y-2 text-left ml-0.5 text-gray-600'}>Version: v0.4.1</div>
      </SettingGroup>
    </div>
  );
};

export default AboutSection;
