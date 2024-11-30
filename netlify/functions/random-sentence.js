const sentences = [
  "The quick brown fox jumps over the lazy dog.",
  "Hello, how are you today?",
  "What's the weather like?",
  "I love learning new languages!",
  "Could you recommend a good restaurant?",
  "Where is the nearest train station?",
  "Do you have any hobbies?",
  "I enjoy traveling to new places.",
  "What time does the movie start?",
  "Can you help me find my way to the museum?"
];

export const handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
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
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to get random sentence' })
    };
  }
};
