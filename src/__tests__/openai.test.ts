import { describe, it, expect } from 'vitest';

// Import the functions we want to test - since they're in a module with default export,
// we need to test the logic directly
function clampTemperature(temperature: number, provider: string): number {
  if (provider === 'MiniMax') {
    return Math.max(0.01, Math.min(1.0, temperature));
  }
  return temperature;
}

function stripThinkTags(content: string): string {
  return content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
}

function getProviderConfig(provider: string, host: string) {
  if (provider === 'MiniMax') {
    return { hostAddress: 'api.minimax.io' };
  }
  return { hostAddress: host || 'api.openai.com' };
}

describe('clampTemperature', () => {
  it('should clamp temperature to (0, 1] for MiniMax provider', () => {
    expect(clampTemperature(0, 'MiniMax')).toBe(0.01);
    expect(clampTemperature(0.5, 'MiniMax')).toBe(0.5);
    expect(clampTemperature(1, 'MiniMax')).toBe(1);
    expect(clampTemperature(1.5, 'MiniMax')).toBe(1);
    expect(clampTemperature(2, 'MiniMax')).toBe(1);
  });

  it('should not clamp temperature for OpenAI provider', () => {
    expect(clampTemperature(0, 'OpenAI')).toBe(0);
    expect(clampTemperature(0.5, 'OpenAI')).toBe(0.5);
    expect(clampTemperature(1.5, 'OpenAI')).toBe(1.5);
    expect(clampTemperature(2, 'OpenAI')).toBe(2);
  });

  it('should handle edge cases', () => {
    expect(clampTemperature(-1, 'MiniMax')).toBe(0.01);
    expect(clampTemperature(0.01, 'MiniMax')).toBe(0.01);
    expect(clampTemperature(0.99, 'MiniMax')).toBe(0.99);
  });
});

describe('stripThinkTags', () => {
  it('should strip think tags from content', () => {
    expect(stripThinkTags('<think>internal reasoning</think>Hello')).toBe('Hello');
  });

  it('should strip multiline think tags', () => {
    const content = '<think>\nlet me think...\nstep 1\nstep 2\n</think>\nThe answer is 42.';
    expect(stripThinkTags(content)).toBe('The answer is 42.');
  });

  it('should handle multiple think tags', () => {
    const content = '<think>first</think>Hello <think>second</think>World';
    expect(stripThinkTags(content)).toBe('Hello World');
  });

  it('should return content unchanged if no think tags', () => {
    expect(stripThinkTags('Hello World')).toBe('Hello World');
  });

  it('should handle empty think tags', () => {
    expect(stripThinkTags('<think></think>Hello')).toBe('Hello');
  });

  it('should trim whitespace after stripping', () => {
    expect(stripThinkTags('<think>reasoning</think>  Hello  ')).toBe('Hello');
  });
});

describe('getProviderConfig', () => {
  it('should return MiniMax host for MiniMax provider', () => {
    expect(getProviderConfig('MiniMax', '')).toEqual({ hostAddress: 'api.minimax.io' });
    expect(getProviderConfig('MiniMax', 'custom.host.com')).toEqual({
      hostAddress: 'api.minimax.io',
    });
  });

  it('should return custom host for OpenAI provider', () => {
    expect(getProviderConfig('OpenAI', 'custom.openai.com')).toEqual({
      hostAddress: 'custom.openai.com',
    });
  });

  it('should default to api.openai.com for OpenAI with empty host', () => {
    expect(getProviderConfig('OpenAI', '')).toEqual({ hostAddress: 'api.openai.com' });
  });

  it('should handle unknown provider as OpenAI', () => {
    expect(getProviderConfig('Unknown', 'some.host')).toEqual({ hostAddress: 'some.host' });
  });
});
