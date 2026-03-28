export const minimaxTTSVoices = [
  'English_Graceful_Lady',
  'English_Insightful_Speaker',
  'English_radiant_girl',
  'English_Persuasive_Man',
  'English_Lucky_Robot',
  'Wise_Woman',
  'cute_boy',
  'lovely_girl',
  'Friendly_Person',
  'Inspirational_girl',
  'Deep_Voice_Man',
  'sweet_girl',
];

export const minimaxTTSModels = ['speech-2.8-hd', 'speech-2.8-turbo'];

export default async function speechSynthesizeWithMiniMax(
  apiKey: string,
  text: string,
  voiceId: string,
  model: string
): Promise<string> {
  const response = await fetch('https://api.minimax.io/v1/t2a_v2', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + apiKey,
    },
    body: JSON.stringify({
      model: model || 'speech-2.8-hd',
      text: text,
      voice_setting: {
        voice_id: voiceId || 'English_Graceful_Lady',
      },
      audio_setting: {
        format: 'mp3',
      },
    }),
  });

  const data = await response.json();

  if (data?.base_resp?.status_code !== 0) {
    throw new Error(data?.base_resp?.status_msg || 'MiniMax TTS request failed');
  }

  const audioHex = data?.data?.audio;
  if (!audioHex) {
    throw new Error('No audio data in MiniMax TTS response');
  }

  const bytes = new Uint8Array(audioHex.length / 2);
  for (let i = 0; i < audioHex.length; i += 2) {
    bytes[i / 2] = parseInt(audioHex.substr(i, 2), 16);
  }
  const blob = new Blob([bytes], { type: 'audio/mpeg' });
  return URL.createObjectURL(blob);
}
