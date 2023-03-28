import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enLocale from './locales/en.json';
import zhLocale from './locales/zh-CN.json';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enLocale,
    },
    zh: {
      translation: zhLocale,
    },
  },
  fallbackLng: localStorage.getItem('language') || 'en',
});

export default i18n;
