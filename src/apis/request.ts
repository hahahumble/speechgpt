import axios from "axios";
const requests = axios.create({
    baseURL:'http://10.240.208.54:30080/proxy/v1/',
    headers:{
        "Content-Type":'application/json'
    }
})

export default requests


// export default async function sendRequest(
//     messages: string[],
//     callback: (data: any) => void
//   ) {
//     const requestOptions = {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer ' + openaiApiKey,
//       },
//       body: JSON.stringify({
//         model: openaiModel || 'gpt-3.5-turbo',
//         messages: messages,
//       }),
//     };
  
//     const openaiHostAddress = openaiHost || 'api.openai.com';
  
//     fetch('https://' + openaiHostAddress + '/v1/chat/completions', requestOptions)
//       .then(response => response.json())
//       .then(data => {
//         callback(data);
//       })
//       .catch(err => {
//         return err;
//       });
//   }