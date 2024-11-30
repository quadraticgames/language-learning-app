import fetch from 'node-fetch';

export const handler = async (event, context) => {
  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { text, targetLanguage } = JSON.parse(event.body);
    console.log('Received translation request:', { text, targetLanguage });

    if (!text || !targetLanguage) {
      console.error('Missing parameters:', { text, targetLanguage });
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required parameters' })
      };
    }

    // Using MyMemory Translation API (free, no API key required)
    const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLanguage}`;
    console.log('Calling translation API:', apiUrl);

    const response = await fetch(apiUrl);
    console.log('Translation API status:', response.status);
    
    const data = await response.json();
    console.log('Translation API response:', data);

    if (data.responseStatus === 200 && data.responseData) {
      const result = {
        translation: data.responseData.translatedText
      };
      console.log('Sending successful response:', result);
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: JSON.stringify(result)
      };
    } else {
      console.error('Translation API error:', data);
      throw new Error('Translation API returned an invalid response');
    }
  } catch (error) {
    console.error('Translation function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Translation failed',
        details: error.message
      })
    };
  }
};
