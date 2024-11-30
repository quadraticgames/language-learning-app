import fetch from 'node-fetch';

// Utility function to safely parse JSON
const safeParseJSON = (body) => {
  try {
    return JSON.parse(body);
  } catch (error) {
    console.error('JSON parsing error:', error);
    return null;
  }
};

export const handler = async (event, context) => {
  // Log the entire incoming event for debugging
  console.log('Incoming event:', JSON.stringify(event, null, 2));

  // CORS preflight handling
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: ''
    };
  }

  // Validate HTTP method
  if (event.httpMethod !== 'POST') {
    console.error('Invalid HTTP method:', event.httpMethod);
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Parse request body
    const requestBody = safeParseJSON(event.body);
    
    if (!requestBody) {
      console.error('Failed to parse request body');
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Invalid request body' })
      };
    }

    const { text, targetLanguage } = requestBody;
    
    // Validate input parameters
    if (!text || !targetLanguage) {
      console.error('Missing parameters:', { text, targetLanguage });
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Missing required parameters' })
      };
    }

    // Construct translation API URL
    const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLanguage}`;
    console.log('Translation API URL:', apiUrl);

    // Perform translation API request
    const apiResponse = await fetch(apiUrl);
    console.log('Translation API response status:', apiResponse.status);

    // Parse API response
    const apiData = await apiResponse.json();
    console.log('Translation API response data:', JSON.stringify(apiData, null, 2));

    // Validate API response
    if (apiData.responseStatus !== 200 || !apiData.responseData) {
      console.error('Translation API error:', apiData);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'Translation failed', 
          details: apiData 
        })
      };
    }

    // Return successful translation
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        translation: apiData.responseData.translatedText
      })
    };

  } catch (error) {
    // Catch-all error handler
    console.error('Unexpected error in translation function:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Internal Server Error', 
        details: error.message 
      })
    };
  }
};
