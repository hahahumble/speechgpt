import React, { useEffect } from 'react';
import RecordRTC, { StereoAudioRecorder } from 'recordrtc';
import axios from 'axios';

interface AssemblyAISpeechToTextProps {
  isListening: boolean;
  setIsListening: (update: ((prevIsListening: boolean) => boolean) | boolean) => void;
  setTranscript: (update: ((prevTranscript: string) => string) | string) => void;
}

const AssemblyAISpeechToText: React.FC<AssemblyAISpeechToTextProps> = ({
  isListening,
  setIsListening,
  setTranscript,
}) => {
  
  useEffect(() => {
    let socket;
    let recorder;

    const run = async () => {
      if (isListening) {
        const response = await fetch('http://localhost:8000');
        const data = await response.json();

        if (data.error) {
          alert(data.error);
        }

        const { token } = data;
        socket = await new WebSocket(`wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`);

        socket.onmessage = (message) => {
          let msg = '';
          const texts = {};
          const res = JSON.parse(message.data);
          console.log(res)
          if (res.audio_start !== undefined && res.message_type != "PartialTranscript" ) {
            setTranscript('');
            texts[res.audio_start] = res.text;
            console.log("texts:" + texts)
            const keys = Object.keys(texts);
            keys.sort((a, b) => a - b);
            for (const key of keys) {
              if (texts[key]) {
                msg = ` ${texts[key]}`;
              }
            }
            setTranscript(msg);
          }
          if (res.audio_start !== undefined && res.message_type == "PartialTranscript" ) {
            texts[res.audio_start] = res.text;
            console.log("texts:" + texts)
            const keys = Object.keys(texts);
            keys.sort((a, b) => a - b);
            for (const key of keys) {
              if (texts[key]) {
                msg = ` ${texts[key]}`;
              }
            }
            setTranscript(msg);
          }

          // if (result.isFinal) {
          //   setTranscript(text);
          // } else {
          //   currentTranscript += text;
          // }
          
        };

        socket.onerror = (event) => {
          console.error(event);
          socket.close();
        };

        socket.onclose = (event) => {
          console.log(event);
          socket = null;
        };

        socket.onopen = () => {
          navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
              recorder = new RecordRTC(stream, {
                type: 'audio',
                mimeType: 'audio/webm;codecs=pcm',
                recorderType: StereoAudioRecorder,
                timeSlice: 250,
                desiredSampRate: 16000,
                numberOfAudioChannels: 1,
                bufferSize: 4096,
                audioBitsPerSecond: 128000,
                ondataavailable: (blob) => {
                  const reader = new FileReader();
                  reader.onload = () => {
                    const base64data = reader.result;

                    if (socket) {
                      socket.send(JSON.stringify({ audio_data: base64data.split('base64,')[1] }));
                    }
                  };
                  reader.readAsDataURL(blob);
                },
              });

              recorder.startRecording();
            })
            .catch((err) => console.error(err));
        };
      } else {
        if (socket) {
          socket.send(JSON.stringify({ terminate_session: true }));
          socket.close();
          socket = null;
        }

        if (recorder) {
          recorder.pauseRecording();
          recorder = null;
        }
      }
    };

    run();

    return () => {
      if (socket) {
        socket.send(JSON.stringify({ terminate_session: true }));
        socket.close();
      }

      if (recorder) {
        recorder.pauseRecording();
      }
    };
  }, [isListening, setIsListening, setTranscript]);

  return null;
};

export default AssemblyAISpeechToText;
