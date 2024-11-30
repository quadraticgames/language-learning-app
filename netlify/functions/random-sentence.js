const fs = require('fs');
const path = require('path');

// Store sentences directly in the function to ensure availability in Netlify environment
const sentences = `The quick brown fox jumps over the lazy dog.
Hello, how are you today?
What's the weather like?
I love learning new languages!
Could you recommend a good restaurant?
Where is the nearest train station?
Do you have any hobbies?
I enjoy traveling to new places.
What time does the movie start?
Can you help me find my way to the museum?
The food at this restaurant is delicious!
I need to buy some groceries.
What's your favorite book?
How long have you been studying this language?
Would you like to get coffee sometime?
My family is coming to visit next week.
The concert was amazing last night!
I'm planning a trip to Europe.
Could you speak more slowly, please?
What do you do for work?
This is my first time here.
The sunset is beautiful tonight.
I lost my keys, can you help me find them?
How do you say "thank you" in your language?
What are your plans for the weekend?
I'm learning to cook traditional dishes.
The garden looks lovely in spring.
Have you tried the local specialties?
When does the bus arrive?
I'd like to make a reservation for dinner.`.split('\n').filter(line => line.trim() !== '');

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
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to get random sentence' })
    };
  }
};
