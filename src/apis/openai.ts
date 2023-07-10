export default async function sendRequest(
  messages: string[],
  // openaiApiKey: string,
  // openaiHost: string,
  // openaiModel: string,
  callback: (data: any) => void
) {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Authorization: 'Bearer ' + openaiApiKey,
    },
    body: JSON.stringify({
      // model: openaiModel || 'gpt-3.5-turbo',
      model:'merged',
      messages: messages,
    }),
  };

  // const openaiHostAddress = openaiHost || 'api.openai.com';

  fetch('http://10.240.208.54:30080/proxy/v1/chat/completions', requestOptions)
    .then(response => response.json())
    .then(data => {
      callback(data);
    })
    .catch(err => {
      return err;
    });
}