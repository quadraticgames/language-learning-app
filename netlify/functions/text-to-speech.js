const textToSpeech = require('@google-cloud/text-to-speech');

// Utility function to safely parse JSON
const safeParseJSON = (body) => {
  try {
    return JSON.parse(body);
  } catch (error) {
    console.error('JSON parsing error:', error);
    return null;
  }
};

exports.handler = async function(event, context) {
  console.log('Text-to-speech function started');
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

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    console.error('Invalid HTTP method:', event.httpMethod);
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
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

    const { text, languageCode } = requestBody;
    console.log('Text-to-speech request:', { text, languageCode });

    if (!text || !languageCode) {
      console.error('Missing parameters:', { text, languageCode });
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Text and language code are required' })
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

    // Create credentials from environment variable
    console.log('Parsing credentials');
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    console.log('Project ID:', credentials.project_id);

    // Create the client
    console.log('Initializing Text-to-Speech client');
    const client = new textToSpeech.TextToSpeechClient({ 
      credentials,
      projectId: credentials.project_id
    });

    // Construct the request
    const request = {
      input: { text },
      voice: { languageCode, ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3' },
    };

    // Perform the text-to-speech request
    console.log('Starting text-to-speech synthesis');
    const [response] = await client.synthesizeSpeech(request);
    console.log('Speech synthesis successful');

    // Convert audio content to base64
    const audioContent = response.audioContent.toString('base64');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ audioContent })
    };
  } catch (error) {
    console.error('Text-to-speech error:', {
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

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Failed to generate speech',
        details: error.message,
        type: error.name,
        code: error.code
      })
    };
  }
};
