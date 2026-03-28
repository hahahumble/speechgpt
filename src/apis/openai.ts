export interface SendRequestOptions {
  messages: string[];
  apiKey: string;
  host: string;
  model: string;
  provider?: string;
  temperature?: number;
}

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

export default async function sendRequest(
  messages: string[],
  apiKey: string,
  host: string,
  model: string,
  callback: (data: any) => void,
  provider: string = 'OpenAI',
  temperature?: number
) {
  const { hostAddress } = getProviderConfig(provider, host);
  const finalTemperature =
    temperature !== undefined ? clampTemperature(temperature, provider) : undefined;

  const body: any = {
    model: model || (provider === 'MiniMax' ? 'MiniMax-M2.7' : 'gpt-3.5-turbo'),
    messages: messages,
  };
  if (finalTemperature !== undefined) {
    body.temperature = finalTemperature;
  }

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + apiKey,
    },
    body: JSON.stringify(body),
  };

  fetch('https://' + hostAddress + '/v1/chat/completions', requestOptions)
    .then(response => response.json())
    .then(data => {
      if (data?.choices?.[0]?.message?.content && provider === 'MiniMax') {
        data.choices[0].message.content = stripThinkTags(data.choices[0].message.content);
      }
      callback(data);
    })
    .catch(err => {
      return err;
    });
}
