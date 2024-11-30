const fs = require('fs');
const path = require('path');

// Load sentences from file
function loadSentences() {
  try {
    const filePath = path.join(__dirname, 'data', 'sentences.txt');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return fileContent.split('\n').filter(line => line.trim() !== '');
  } catch (error) {
    console.error('Error reading sentences file:', error);
    return [
      "The quick brown fox jumps over the lazy dog.",
      "Hello, world!",
      "Please add sentences to the sentences.txt file."
    ];
  }
}

export const handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const sentences = loadSentences();
    const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
    
    console.log('Random sentence selected:', randomSentence);
    console.log('Response body:', JSON.stringify({ sentence: randomSentence }));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: JSON.stringify({ sentence: randomSentence })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to get random sentence' })
    };
  }
};
