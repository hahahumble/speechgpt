import LanguageSelector from './LocaleSelector';
import AppearanceSelector from './AppearanceSelector';
import React from 'react';
import SpeechGPTIcon from './Icons/SpeechGPTIcon';

function Header() {
  return (
    <div className="flex flex-col sm:pt-16 sticky pt-16">
      {/* <SpeechGPTIcon className="w-16 h-16 ml-2 sm:w-24 sm:h-24" /> */}
      <div className="flex flex-row py-2 justify-between items-center w-full">
        <div className="text-2xl font-bold text-left text-gray-800">
          <span className="font-bold ml-2 decoration-purple-500 animate-text text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            NewTalk
          </span>
        </div>
        <div>
          <LanguageSelector />
          {/*<AppearanceSelector/>*/}
        </div>
      </div>
    </div>
  );
}

export default Header;
