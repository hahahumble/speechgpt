import axios from 'axios';

export async function getAzureToken(subscriptionKey: string, region: string): Promise<string> {
  const url = `https://${region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`;

  try {
    const response = await axios.post(url, null, {
      headers: {
        'Ocp-Apim-Subscription-Key': subscriptionKey,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(`Error getting token: ${error}`);
  }
}
