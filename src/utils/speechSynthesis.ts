import speechSynthesizeWithPolly from '../apis/amazonPolly';
import speechSynthesizeWithAzure from '../apis/azureTTS';
import { SpeakerAudioDestination } from 'microsoft-cognitiveservices-speech-sdk';
import { getAzureToken } from '../apis/azureToken';

interface SpeechSynthesisOptions {
  text: string;
  service: 'System' | 'Amazon Polly' | 'Azure TTS';
  language: string;
  rate?: number;
  pitch?: number;
  voiceName: string;
  engine?: string;
  region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  notify: any;
}

interface getPollyVoicesOptions {
  text: string;
  voiceName: string;
  engine?: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}

const synthesis = window.speechSynthesis;
let pollyAudio: HTMLAudioElement | null = null;
let azureAudio: SpeakerAudioDestination | null = null;

async function getPollyVoices({
  text,
  voiceName,
  engine,
  region,
  accessKeyId,
  secretAccessKey,
}: getPollyVoicesOptions) {
  return await speechSynthesizeWithPolly(
    text,
    voiceName,
    engine,
    region,
    accessKeyId,
    secretAccessKey
  );
}

function pollyEngineName(engine: string | undefined) {
  if (engine === 'Neural') {
    return 'neural';
  } else {
    return 'standard';
  }
}

export function speechSynthesis({
  text,
  service,
  language,
  rate,
  pitch,
  voiceName,
  engine,
  region,
  accessKeyId,
  secretAccessKey,
  notify,
}: SpeechSynthesisOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    const speakWithVoice = () => {
      const synthesis = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);

      utterance.lang = language;
      utterance.rate = rate || 1;
      utterance.pitch = pitch || 1;

      const voice = synthesis.getVoices().find(v => v.name === voiceName);

      if (voice) {
        utterance.voice = voice;
      }
      console.log(utterance);

      // Add the 'end' event listener to resolve the Promise
      utterance.addEventListener('end', () => {
        resolve();
      });

      // Add the 'error' event listener to reject the Promise
      utterance.addEventListener('error', error => {
        if (error.error === 'interrupted') {
          return;
        }
        notify.errorBuiltinSpeechSynthesisNotify();
        reject(error);
      });

      synthesis.speak(utterance);
    };

    switch (service) {
      case 'System':
        if (window.speechSynthesis.getVoices().length === 0) {
          window.speechSynthesis.onvoiceschanged = () => {
            speakWithVoice();
          };
        } else {
          speakWithVoice();
        }
        break;
      case 'Amazon Polly':
        getPollyVoices({
          text,
          voiceName,
          engine: pollyEngineName(engine) || 'neural',
          region: region || 'us-east-1',
          accessKeyId: accessKeyId || '', //
          secretAccessKey: secretAccessKey || '',
        })
          .then(url => {
            pollyAudio = new Audio(url as string);
            pollyAudio.play();
            pollyAudio.onended = () => {
              resolve();
            };
            pollyAudio.onerror = error => {
              reject(error);
              notify.awsErrorNotify();
            };
          })
          .catch(error => {
            reject(error);
            notify.awsErrorNotify();
          });
        break;
      case 'Azure TTS':
        if (secretAccessKey == '') {
          reject('Azure access key is empty');
          notify.emptyAzureKeyNotify();
          return;
        }
        // Check if secret access key and region is valid
        getAzureToken(secretAccessKey || '', region || 'eastus')
          .then(token => {})
          .catch(error => {
            notify.invalidAzureKeyNotify();
            reject(error);
          });
        speechSynthesizeWithAzure(
          secretAccessKey || '',
          region || 'eastus',
          text,
          voiceName,
          language
        )
          .then(player => {
            azureAudio = player;
            player.onAudioEnd = () => {
              resolve();
            };
          })
          .catch(error => {
            console.error(error);
            notify.azureSynthesisErrorNotify();
            reject(error);
          });
        break;
    }
  });
}

export function stopSpeechSynthesis() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  } else {
    console.error('Speech synthesis is not supported in this browser.');
  }
  if (pollyAudio) {
    pollyAudio.pause();
    pollyAudio.currentTime = 0;
  }
  if (azureAudio) {
    azureAudio.pause();
    azureAudio.close();
  }
}

export function pauseSpeechSynthesis() {
  if (window.speechSynthesis) {
    window.speechSynthesis.pause();
  } else {
    console.error('Speech synthesis is not supported in this browser.');
  }
  if (pollyAudio) {
    pollyAudio.pause();
  }
  if (azureAudio) {
    azureAudio.pause();
  }
}

export function resumeSpeechSynthesis() {
  if (window.speechSynthesis) {
    window.speechSynthesis.resume();
  } else {
    console.error('Speech synthesis is not supported in this browser.');
  }
  if (pollyAudio) {
    pollyAudio.play();
  }
  if (azureAudio) {
    azureAudio.resume();
  }
}
