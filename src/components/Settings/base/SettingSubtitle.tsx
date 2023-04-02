import React from 'react';
import Tippy from '@tippyjs/react';
import HelpIcon from '../../Icons/HelpIcon';

interface SettingSubtitleProps {
  text: string;
  helpText?: string;
}

function SettingSubtitle({ text, helpText }: SettingSubtitleProps) {
  return (
    <div className="text-left text-gray-600 font flex flex-row items-center">
      {text}
      {helpText && (
        <div className="ml-1.5">
          <Tippy
            content={helpText}
            placement="bottom"
            duration={0}
            hideOnClick={true}
            trigger={'mouseenter'}
            theme={'light'}
          >
            <div>
              <HelpIcon className="w-4 h-4 mt-0.5 text-gray-400" />
            </div>
          </Tippy>
        </div>
      )}
    </div>
  );
}

export default SettingSubtitle;
