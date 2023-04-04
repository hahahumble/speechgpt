import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enLocale from './locales/en.json';
import esLocale from './locales/es.json';
import zhLocale from './locales/zh-CN.json';

function getLocaleFromLocalStorage() {
  const storedData = localStorage.getItem('globalState');

  if (storedData) {
    const parsedData = JSON.parse(storedData);
    return parsedData.locale || 'en';
  }

  return 'en';
}

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enLocale,
    },
    zh: {
      translation: zhLocale,
    },
    es: {
      translation: esLocale,
    },
  },
  fallbackLng: getLocaleFromLocalStorage() || 'en',
});

export default i18n;
