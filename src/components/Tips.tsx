import BlubIcon from './Icons/BlubIcon';
import RightTriangleIcon from './Icons/RightTriangleIcon';
import React from 'react';
import { useTranslation } from 'react-i18next';

function Tips() {
  const { i18n } = useTranslation();

  return (
    <div className="flex flex-col items-start justify-center h-full">
      <div className="flex flex-col items-start justify-center space-y-2">
        <div className="flex flex-row items-center space-x-2 pb-2">
          <BlubIcon className="w-8 h-8 text-gray-800" />
          <div className="text-xl font-medium text-gray-800">{i18n.t('common.tips') as string}</div>
        </div>
        <div className="text-gray-800 leading-7 flex flex-row">
          <RightTriangleIcon className="w-7 h-7 text-gray-800 shrink-0" strokeWidth="1.5" />
          <div>
            <div
              dangerouslySetInnerHTML={{
                __html: i18n.t('tips.tips1') as string,
              }}
            />
          </div>
        </div>
        <div className="text-gray-800 leading-7 flex flex-row">
          <RightTriangleIcon className="w-7 h-7 text-gray-800 shrink-0" strokeWidth="1.5" />
          <div
            dangerouslySetInnerHTML={{
              __html: i18n.t('tips.tips2') as string,
            }}
          />
        </div>
        <div className="text-gray-800 leading-7 flex flex-row">
          <RightTriangleIcon className="w-7 h-7 text-gray-800 shrink-0" strokeWidth="1.5" />
          <div>
            <span className="border w-min inline py-0.5 px-2 border-gray-700 rounded-md">
              Shift
            </span>{' '}
            +&nbsp;
            <span className="border w-min inline py-0.5 px-2 border-gray-700 rounded-md">
              Enter
            </span>
            &nbsp; {i18n.t('tips.tips3a') as string}&nbsp;
            <span className="border w-min inline py-0.5 px-2 border-gray-700 rounded-md">
              Enter
            </span>
            &nbsp; {i18n.t('tips.tips3b') as string}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tips;
