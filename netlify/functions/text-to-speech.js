const textToSpeech = require('@google-cloud/text-to-speech');
const { Readable } = require('stream');

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the request body
    const { text, languageCode } = JSON.parse(event.body);

    if (!text || !languageCode) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Text and language code are required' })
      };
    }

    // Create credentials from environment variable
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

    // Create the client
    const client = new textToSpeech.TextToSpeechClient({ credentials });

    // Construct the request
    const request = {
      input: { text },
      voice: { languageCode, ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3' },
    };

    // Perform the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);

    // Convert audio content to base64
    const audioContent = response.audioContent.toString('base64');

    return {
      statusCode: 200,
      body: JSON.stringify({ audioContent }),
      headers: {
        'Content-Type': 'application/json'
      }
    };
  } catch (error) {
    console.error('Text-to-speech error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to generate speech',
        details: error.message 
      })
    };
  }
};
