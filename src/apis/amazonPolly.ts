import { Polly } from '@aws-sdk/client-polly';
import { getSynthesizeSpeechUrl } from '@aws-sdk/polly-request-presigner';

const speechParams = {
  OutputFormat: 'mp3',
  SampleRate: '16000',
  VoiceId: 'Matthew',
  TextType: 'text',
  Text: '',
  Engine: 'neural',
};

export default async function generateSpeechUrl(
  text: string,
  voiceId: string = 'Matthew',
  engine: string = 'neural',
  aws_region: string,
  aws_id: string,
  aws_key: string
) {
  speechParams.Text = text;
  speechParams.VoiceId = voiceId;
  speechParams.Engine = engine;

  try {
    const polly = new Polly({
      region: aws_region,
      credentials: {
        accessKeyId: aws_id,
        secretAccessKey: aws_key,
      },
    });
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Polly.html#synthesizeSpeech-property
    return getSynthesizeSpeechUrl({ client: polly, params: speechParams });
  } catch (err) {
    console.log('Error', err);
  }
}
