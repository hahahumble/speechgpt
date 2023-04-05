import React, { useEffect, useRef } from 'react';
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
  const selectRef = useRef<HTMLSelectElement>(null);
  const hiddenSpanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (locale === '') {
      const browserLanguage = navigator.language.split(/[-_]/)[0];
      setLocale(browserLanguage);
    }
    setTimeout(() => {
      i18n.changeLanguage(locale);
    }, 100);
  }, [locale]);

  const languages: LanguageOption[] = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'zh', name: '中文' },
  ];

  useEffect(() => {
    if (selectRef.current && hiddenSpanRef.current) {
      const width = hiddenSpanRef.current.offsetWidth + 25;
      selectRef.current.style.width = width + 'px';
    }
  }, [locale]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocale(e.target.value);
  };

  const selectedLanguage = languages.find(lang => lang.code === locale);

  return (
    <div className="relative inline-block">
      <span ref={hiddenSpanRef} className="absolute top-0 left-0 opacity-0 -z-10 pr-6">
        {selectedLanguage?.name}
      </span>
      <select
        ref={selectRef}
        onChange={e => handleLanguageChange(e)}
        value={locale}
        className="mr-0.5 w-auto bg-gray-100 text-gray-700 border border-gray-300 rounded-md py-2 px-3 focus:outline-none hover:bg-gray-200 transition duration-100 ease-in-out"
      >
        {languages.map(language => (
          <option key={language.code} value={language.code}>
            {language.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default LanguageSelector;
