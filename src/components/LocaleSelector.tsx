import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'tippy.js/dist/tippy.css';
import { useGlobalStore } from '../store/module';

interface LanguageOption {
  code: string;
  name: string;
}

function LanguageSelector() {
  const { i18n } = useTranslation();
  const { locale, setLocale } = useGlobalStore();

  useEffect(() => {
    if (locale == '') {
      const browserLanguage = navigator.language.split(/[-_]/)[0];
      setLocale(browserLanguage);
    }
    i18n.changeLanguage(locale);
  }, [locale]);

  const languages: LanguageOption[] = [
    { code: 'en', name: 'English' },
    { code: 'zh', name: '中文' },
  ];

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocale(e.target.value);
  };

  return (
    <select
      onChange={e => handleLanguageChange(e)}
      value={locale}
      className="mr-0.5 w-24 bg-gray-100 text-gray-700 border border-gray-300 rounded-md py-2 px-3 focus:outline-none hover:bg-gray-200 transition duration-100 ease-in-out"
    >
      {languages.map(language => (
        <option key={language.code} value={language.code}>
          {language.name}
        </option>
      ))}
    </select>
  );
}

export default LanguageSelector;
