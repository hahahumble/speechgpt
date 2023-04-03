export default async function sendRequest(
  messages: string[],
  openaiApiKey: string,
  openaiHost: string,
  callback: (data: any) => void
) {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + openaiApiKey,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: messages,
    }),
  };

  const openaiHostAddress = openaiHost || 'api.openai.com';

  fetch('https://' + openaiHostAddress + '/v1/chat/completions', requestOptions)
    .then(response => response.json())
    .then(data => {
      callback(data);
    })
    .catch(err => {
      return err;
    });
}
