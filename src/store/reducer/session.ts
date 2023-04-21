import { createSlice } from '@reduxjs/toolkit';
import { SessionState } from '../../typings/session';
import { getFormatDateTime } from '../../helpers/utils';
import { v4 as uuidv4 } from 'uuid';
import i18n from '../../i18n'; // Import i18n instance

export const initialState: SessionState = {
  currentSessionId: 0,
  order: '',
  sessions: [
    {
      id: uuidv4(),
      topic: i18n.t('conversations.new-conversation'),
      tags: [],
      liked: false,
      date: getFormatDateTime(new Date().toISOString()),
      stats: {
        messageCount: 0,
        tokenCount: 0,
        characterCount: 0,
      },
      chat: {
        systemRole: '',
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
  ],
};

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setCurrentSessionId: (state, action) => {
      state.currentSessionId = action.payload;
    },
    setSessions: (state, action) => {
      state.sessions = action.payload;
    },
    addSession: (state, action) => {
      const { id, topic, messageCount } = action.payload;
      state.sessions.unshift({
        id,
        topic,
        tags: [],
        liked: false,
        date: getFormatDateTime(new Date().toISOString()),
        stats: {
          messageCount: messageCount || 0,
          tokenCount: 0,
          characterCount: 0,
        },
        chat: {
          systemRole: '',
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
      });
    },
    removeSession: (state, action) => {
      const { id } = action.payload;
      state.sessions = state.sessions.filter(session => session.id !== id);
    },
    updateSession: (state, action) => {
      const { id, topic } = action.payload;
      const index = state.sessions.findIndex(session => session.id === id);
      if (index !== -1) {
        state.sessions[index].topic = topic;
      }
    },
    clearSessions: state => {
      state.sessions = [];
    },
    setMessageCount: (state, action) => {
      const { id, messageCount } = action.payload;
      const index = state.sessions.findIndex(session => session.id === id);
      if (index !== -1) {
        state.sessions[index].stats.messageCount = messageCount;
      }
    },
    setLiked: (state, action) => {
      const { id, liked } = action.payload;
      const index = state.sessions.findIndex(session => session.id === id);
      if (index !== -1) {
        state.sessions[index].liked = liked;
      }
    },
  },
});

export const {
  setCurrentSessionId,
  setSessions,
  addSession,
  removeSession,
  updateSession,
  clearSessions,
  setMessageCount,
  setLiked,
} = sessionSlice.actions;

export default sessionSlice.reducer;
