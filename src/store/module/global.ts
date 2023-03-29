import { useSelector, useDispatch } from 'react-redux';
import store from '../index';
import { useEffect } from 'react';

function deepMerge(obj1: any, obj2: any) {
  const result = { ...obj1 };

  for (const key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (typeof obj2[key] === 'object' && obj2[key] !== null && !Array.isArray(obj2[key])) {
        result[key] = deepMerge(obj1[key], obj2[key]);
      } else {
        result[key] = obj2[key];
      }
    }
  }

  return result;
}

const defaultGlobalState = {
  locale: navigator.language.split(/[-_]/)[0] || '',
  appearance: 'system',
  key: {
    openaiApiKey: '',
    openaiModel: '',
    awsRegion: '',
    awsKeyId: '',
    awsKey: '',
    azureRegion: '',
    azureKey: '',
  },
  chat: {
    systemRole: 'From now on, the number of words in your reply cannot exceed 50 words.',
    defaultPrompt: '',
    useAssistant: false,
    temperature: 0.8,
    maxMessages: 20,
  },
  speech: {
    service: 'System',
    systemLanguage: 'en',
    systemVoice: 'Daniel',
    systemRate: 1,
    systemPitch: 1,
    pollyLanguage: 'en-US',
    pollyVoice: '',
    pollyEngine: 'Standard',
    azureLanguage: 'en-US',
    azureVoice: '',
  },
  voice: {
    service: 'System',
    systemLanguage: 'en-US',
    azureLanguage: 'en-US',
    autoStart: false,
    startTime: 1,
  },
};

export const initialGlobalState = () => {
  let stateJson = localStorage.getItem('globalState');

  if (stateJson) {
    let storedState = JSON.parse(stateJson);
    // Merge storedState with defaultGlobalState
    let state = deepMerge(defaultGlobalState, storedState);

    // Update each property in the store
    for (let [key, value] of Object.entries(state)) {
      store.dispatch({
        type: `global/set${key.charAt(0).toUpperCase() + key.slice(1)}`,
        payload: value,
      });
    }

    // Save the updated state back to localStorage
    localStorage.setItem('globalState', JSON.stringify(state));
  } else {
    // Save the defaultGlobalState to localStorage
    localStorage.setItem('globalState', JSON.stringify(defaultGlobalState));
  }
};

const selectGlobal = (state: any) => state.global;

const saveStateToLocalStorage = (state: any) => {
  localStorage.setItem('globalState', JSON.stringify(state));
};

export const useGlobalStore = () => {
  const dispatch = useDispatch();

  const state = useSelector(selectGlobal);

  useEffect(() => {
    // Subscribe to state changes
    const unsubscribe = store.subscribe(() => {
      saveStateToLocalStorage(store.getState().global);
    });

    // Clean up the subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);
  const setLocale = (locale: string) => {
    dispatch({ type: 'global/setLocale', payload: locale });
  };

  const setAppearance = (appearance: string) => {
    dispatch({ type: 'global/setAppearance', payload: appearance });
  };

  const setKey = (key: any) => {
    dispatch({ type: 'global/setKey', payload: key });
  };

  const setChat = (chat: any) => {
    dispatch({ type: 'global/setChat', payload: chat });
  };

  const setSpeech = (speech: any) => {
    dispatch({ type: 'global/setSpeech', payload: speech });
  };

  const setVoice = (voice: any) => {
    dispatch({ type: 'global/setVoice', payload: voice });
  };

  return {
    ...state,
    setLocale,
    setAppearance,
    setKey,
    setChat,
    setSpeech,
    setVoice,
  };
};
