import { createSlice } from '@reduxjs/toolkit';

export const globalSlice = createSlice({
  name: 'global',
  initialState: {
    locale: navigator.language.split(/[-_]/)[0] || '',
    appearance: 'system',
    developer: false,
    disableSpeaker: false,
    disableMicrophone: false,
    key: {
      accessCode: '',
      openaiApiKey: '',
      openaiModel: '',
      openaiHost: '',
      awsRegion: '',
      awsKeyId: '',
      awsKey: '',
      azureRegion: '',
      azureKey: '',
    },
    chat: {
      systemRole: 'From now on, the number of words in your reply cannot exceed 50 words.',
      defaultPrompt: '',
      useAssistant: true,
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
  },
  reducers: {
    setLocale: (state, action) => {
      state.locale = action.payload;
    },
    setAppearance: (state, action) => {
      state.appearance = action.payload;
    },
    setDeveloper: (state, action) => {
      state.developer = action.payload;
    },
    setDisableSpeaker: (state, action) => {
      state.disableSpeaker = action.payload;
    },
    setDisableMicrophone: (state, action) => {
      state.disableMicrophone = action.payload;
    },
    setKey: (state, action) => {
      state.key = action.payload;
    },
    setChat: (state, action) => {
      state.chat = action.payload;
    },
    setSpeech: (state, action) => {
      state.speech = action.payload;
    },
    setVoice: (state, action) => {
      state.voice = action.payload;
    },
  },
});

export const {
  setLocale,
  setAppearance,
  setDeveloper,
  setDisableSpeaker,
  setDisableMicrophone,
  setKey,
  setChat,
  setSpeech,
  setVoice,
} = globalSlice.actions;

export default globalSlice.reducer;
