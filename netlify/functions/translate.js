import fetch from 'node-fetch';
import { Translate } from '@google-cloud/translate/build/src/v2';

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

    // Initialize Google Translate with API key
    const translate = new Translate({
      key: process.env.GOOGLE_TRANSLATE_API_KEY
    });

    console.log('Translating text...');
    const [translation] = await translate.translate(text, targetLanguage);
    console.log('Translation successful:', translation);

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
        translation: translation
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
