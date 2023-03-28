import ChatSection from './ChatSection';
import SynthesisSection from './SynthesisSection';
import RecognitionSection from './RecognitionSection';
import AboutSection from './AboutSection';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface SettingContentProps {
  selected: string | null;
}

function SettingContent({ selected }: SettingContentProps) {
  const { i18n } = useTranslation();

  switch (selected) {
    case i18n.t('setting.chat.title') as string:
      return <ChatSection />;
    case i18n.t('setting.synthesis.title') as string:
      return <SynthesisSection />;
    case i18n.t('setting.recognition.title') as string:
      return <RecognitionSection />;
    case i18n.t('setting.about.title') as string:
      return <AboutSection />;
    default:
      return <ChatSection />;
  }
}

export default SettingContent;
