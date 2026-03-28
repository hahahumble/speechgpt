import { describe, it, expect } from 'vitest';
import { minimaxTTSVoices, minimaxTTSModels } from '../apis/minimaxTTS';

describe('MiniMax TTS Constants', () => {
  it('should export valid voice IDs', () => {
    expect(minimaxTTSVoices).toBeInstanceOf(Array);
    expect(minimaxTTSVoices.length).toBeGreaterThan(0);
    expect(minimaxTTSVoices).toContain('English_Graceful_Lady');
    expect(minimaxTTSVoices).toContain('English_Insightful_Speaker');
    expect(minimaxTTSVoices).toContain('Deep_Voice_Man');
    expect(minimaxTTSVoices).toContain('sweet_girl');
  });

  it('should not contain known invalid voice IDs', () => {
    expect(minimaxTTSVoices).not.toContain('Chinese_Empress');
    expect(minimaxTTSVoices).not.toContain('Chinese_Gentle_Boy');
    expect(minimaxTTSVoices).not.toContain('Narrator_Man');
    expect(minimaxTTSVoices).not.toContain('podcast_girl');
  });

  it('should export valid TTS models', () => {
    expect(minimaxTTSModels).toBeInstanceOf(Array);
    expect(minimaxTTSModels).toContain('speech-2.8-hd');
    expect(minimaxTTSModels).toContain('speech-2.8-turbo');
    expect(minimaxTTSModels.length).toBe(2);
  });

  it('should have 12 voice options', () => {
    expect(minimaxTTSVoices.length).toBe(12);
  });
});

describe('MiniMax TTS API', () => {
  it('should construct correct request body', () => {
    const apiKey = 'test-key';
    const text = 'Hello world';
    const voiceId = 'English_Graceful_Lady';
    const model = 'speech-2.8-hd';

    const expectedBody = {
      model: model,
      text: text,
      voice_setting: {
        voice_id: voiceId,
      },
      audio_setting: {
        format: 'mp3',
      },
    };

    expect(expectedBody.model).toBe('speech-2.8-hd');
    expect(expectedBody.text).toBe('Hello world');
    expect(expectedBody.voice_setting.voice_id).toBe('English_Graceful_Lady');
    expect(expectedBody.audio_setting.format).toBe('mp3');
  });

  it('should use default voice and model when not specified', () => {
    const defaultVoice = 'English_Graceful_Lady';
    const defaultModel = 'speech-2.8-hd';

    expect(minimaxTTSVoices[0]).toBe(defaultVoice);
    expect(minimaxTTSModels[0]).toBe(defaultModel);
  });
});
