import { getFormatDateTime } from '../helpers/utils';

export interface SessionStore {
  sessions: Session[];
  currentSessionId: string;
  setCurrentSessionId: (id: string) => void;
  setSession: (session: any) => void;
  addSession: (session: any) => void;
  removeSession: (session: any) => void;
  updateSession: (session: any) => void;
  clearSessions: () => void;
  setMessageCount: (session: any) => void;
  setLiked: (session: any) => void;
}

export interface Session {
  id: string;
  topic: string;
  tags: string[];
  liked: boolean;
  date: string;
  stats: {
    messageCount: number;
    tokenCount: number;
    characterCount: number;
  };
  chat: {
    systemRole: string;
    defaultPrompt: string;
    useAssistant: boolean;
    temperature: number;
    maxMessages: number;
  };
  speech: {
    service: string;
    systemLanguage: string;
    systemVoice: string;
    systemRate: number;
    systemPitch: number;
    pollyLanguage: string;
    pollyVoice: string;
    pollyEngine: string;
    azureLanguage: string;
    azureVoice: string;
  };
  voice: {
    service: string;
    systemLanguage: string;
    azureLanguage: string;
    autoStart: boolean;
    startTime: number;
  };
}

export interface SessionState {
  currentSessionId: number;
  order: string;
  sessions: Session[];
}
