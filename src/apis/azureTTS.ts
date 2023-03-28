import axios, { AxiosRequestConfig } from 'axios';

const textToSpeech = async (
  subscriptionKey: string,
  region: string,
  text: string,
  voiceName: string,
  language: string
) => {
  const request: AxiosRequestConfig = {
    method: 'POST',
    url: `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`,
    headers: {
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'riff-16khz-16bit-mono-pcm',
      Authorization: `Bearer ${await getAccessToken(subscriptionKey, region)}`,
    },
    data: `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='${language}'><voice name='${voiceName}'>${text}</voice></speak>`,
    responseType: 'arraybuffer',
  };

  const response = await axios(request);

  return new Blob([response.data], { type: 'audio/wav' });
};

const getAccessToken = async (subscriptionKey: string, region: string) => {
  const request: AxiosRequestConfig = {
    method: 'POST',
    url: `https://${region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
    headers: {
      'Ocp-Apim-Subscription-Key': subscriptionKey,
    },
  };

  const response = await axios(request);

  return response.data;
};

export default textToSpeech;
