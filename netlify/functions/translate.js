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
  console.log('Function started');
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
    console.log('Parsing request body');
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
    console.log('Translation request:', { text, targetLanguage });

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

    // Check if credentials are available
    console.log('Checking credentials');
    if (!process.env.GOOGLE_CREDENTIALS) {
      console.error('GOOGLE_CREDENTIALS environment variable is not set');
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'Configuration error', 
          details: 'Missing credentials' 
        })
      };
    }

    // Initialize Google Translate with credentials
    console.log('Parsing credentials');
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    console.log('Project ID:', credentials.project_id);
    
    console.log('Initializing Translate client');
    const translate = new Translate({
      credentials,
      projectId: credentials.project_id
    });

    console.log('Starting translation');
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
    console.error('Translation error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });

    // Log environment variables (excluding sensitive data)
    console.log('Environment check:', {
      hasGoogleCreds: !!process.env.GOOGLE_CREDENTIALS,
      nodeEnv: process.env.NODE_ENV,
      netlifyDev: process.env.NETLIFY_DEV
    });

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
        details: error.message,
        type: error.name,
        code: error.code
      })
    };
  }
};
