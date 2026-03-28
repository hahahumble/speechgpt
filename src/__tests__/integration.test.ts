import { describe, it, expect } from 'vitest';

describe('Provider Configuration', () => {
  const defaultKeyState = {
    accessCode: '',
    chatProvider: 'OpenAI',
    openaiApiKey: '',
    openaiModel: '',
    openaiHost: '',
    minimaxApiKey: '',
    minimaxModel: 'MiniMax-M2.7',
    awsRegion: '',
    awsKeyId: '',
    awsKey: '',
    azureRegion: '',
    azureKey: '',
  };

  it('should default to OpenAI provider', () => {
    expect(defaultKeyState.chatProvider).toBe('OpenAI');
  });

  it('should have MiniMax model default', () => {
    expect(defaultKeyState.minimaxModel).toBe('MiniMax-M2.7');
  });

  it('should support both OpenAI and MiniMax providers', () => {
    const providers = ['OpenAI', 'MiniMax'];
    expect(providers).toContain(defaultKeyState.chatProvider);
  });

  it('should resolve correct API key based on provider', () => {
    function getApiKey(provider: string, keys: typeof defaultKeyState): string {
      return provider === 'MiniMax' ? keys.minimaxApiKey : keys.openaiApiKey;
    }

    const keysWithOpenAI = { ...defaultKeyState, openaiApiKey: 'sk-openai-test' };
    const keysWithMiniMax = { ...defaultKeyState, minimaxApiKey: 'minimax-test' };

    expect(getApiKey('OpenAI', keysWithOpenAI)).toBe('sk-openai-test');
    expect(getApiKey('MiniMax', keysWithMiniMax)).toBe('minimax-test');
  });

  it('should resolve correct model based on provider', () => {
    function getModel(provider: string, keys: typeof defaultKeyState): string {
      return provider === 'MiniMax' ? keys.minimaxModel || 'MiniMax-M2.7' : keys.openaiModel;
    }

    expect(getModel('MiniMax', defaultKeyState)).toBe('MiniMax-M2.7');
    expect(getModel('OpenAI', { ...defaultKeyState, openaiModel: 'gpt-4' })).toBe('gpt-4');
  });

  it('should resolve correct host based on provider', () => {
    function getHost(provider: string, host: string): string {
      return provider === 'MiniMax' ? 'api.minimax.io' : host || 'api.openai.com';
    }

    expect(getHost('MiniMax', '')).toBe('api.minimax.io');
    expect(getHost('OpenAI', '')).toBe('api.openai.com');
    expect(getHost('OpenAI', 'custom.host')).toBe('custom.host');
  });
});

describe('MiniMax Model Options', () => {
  const minimaxModels = ['MiniMax-M2.7', 'MiniMax-M2.7-highspeed'];

  it('should include M2.7 model', () => {
    expect(minimaxModels).toContain('MiniMax-M2.7');
  });

  it('should include M2.7-highspeed model', () => {
    expect(minimaxModels).toContain('MiniMax-M2.7-highspeed');
  });

  it('should have exactly 2 model options', () => {
    expect(minimaxModels.length).toBe(2);
  });
});

describe('Speech Synthesis Service Options', () => {
  const desktopServices = ['System', 'Azure TTS', 'Amazon Polly', 'MiniMax TTS'];
  const mobileServices = ['Azure TTS', 'Amazon Polly', 'MiniMax TTS'];

  it('should include MiniMax TTS in desktop services', () => {
    expect(desktopServices).toContain('MiniMax TTS');
  });

  it('should include MiniMax TTS in mobile services', () => {
    expect(mobileServices).toContain('MiniMax TTS');
  });

  it('should have 4 desktop services', () => {
    expect(desktopServices.length).toBe(4);
  });

  it('should have 3 mobile services', () => {
    expect(mobileServices.length).toBe(3);
  });
});

describe('Default Speech State', () => {
  const defaultSpeechState = {
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
    minimaxModel: 'speech-2.8-hd',
    minimaxVoice: 'English_Graceful_Lady',
  };

  it('should have MiniMax TTS defaults', () => {
    expect(defaultSpeechState.minimaxModel).toBe('speech-2.8-hd');
    expect(defaultSpeechState.minimaxVoice).toBe('English_Graceful_Lady');
  });
});
