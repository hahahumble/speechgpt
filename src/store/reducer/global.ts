import { createSlice } from '@reduxjs/toolkit';

export const globalSlice = createSlice({
  name: 'global',
  initialState: {
    locale: '',
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
      systemRole: '',
      defaultPrompt: '',
      useAssistant: false,
      temperature: 0.8,
      maxMessages: 100,
    },
    speech: {
      service: '',
      systemLanguage: '',
      systemVoice: '',
      systemRate: 1,
      systemPitch: 1,
      pollyLanguage: '',
      pollyVoice: '',
      pollyEngine: '',
      azureLanguage: '',
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

export const { setLocale, setAppearance, setKey, setChat, setSpeech, setVoice } =
  globalSlice.actions;

export default globalSlice.reducer;
