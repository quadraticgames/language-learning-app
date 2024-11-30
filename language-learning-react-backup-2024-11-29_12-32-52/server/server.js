import express from 'express';
import cors from 'cors';
import { TranslationServiceClient } from '@google-cloud/translate';
import gTTS from 'gtts';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { mkdirSync, readFileSync } from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Google Cloud Translation client
const translationClient = new TranslationServiceClient({
  keyFilename: join(__dirname, 'config', 'google-credentials.json')
});

const app = express();
const port = process.env.PORT || 5000;

// Basic CORS configuration
app.use(cors());

// Additional headers for CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  next();
});

app.use(express.json());
app.use('/audio', express.static(join(__dirname, 'audio')));

// Ensure audio directory exists
mkdirSync(join(__dirname, 'audio'), { recursive: true });

// Create data directory if it doesn't exist
mkdirSync(join(__dirname, 'data'), { recursive: true });

// Get project ID from credentials file
const credentials = JSON.parse(readFileSync(join(__dirname, 'config', 'google-credentials.json')));
const projectId = credentials.project_id;

// Language code mapping
const LANGUAGE_CODES = {
  'es': 'es',    // Spanish
  'fr': 'fr',    // French
  'de': 'de',    // German
  'it': 'it',    // Italian
  'ja': 'ja',    // Japanese
  'zh': 'zh',    // Mandarin Chinese
  'ko': 'ko',    // Korean
  'pt': 'pt',    // Portuguese
  'ru': 'ru',    // Russian
  'ar': 'ar',    // Arabic
  'hi': 'hi',    // Hindi
  'vi': 'vi',    // Vietnamese
  'nl': 'nl'     // Dutch
};

// Read sentences from file
function loadSentences() {
  try {
    const filePath = join(__dirname, 'data', 'sentences.txt');
    const fileContent = readFileSync(filePath, 'utf-8');
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

function getRandomSentence() {
  const sentences = loadSentences();
  return sentences[Math.floor(Math.random() * sentences.length)];
}

app.post('/api/translate', async (req, res) => {
  try {
    console.log('Received translation request:', req.body);
    const { text, targetLanguage } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!LANGUAGE_CODES[targetLanguage]) {
      return res.status(400).json({ error: `Unsupported target language: ${targetLanguage}` });
    }

    const request = {
      parent: `projects/${projectId}/locations/global`,
      contents: [text],
      mimeType: 'text/plain',
      sourceLanguageCode: 'en',
      targetLanguageCode: LANGUAGE_CODES[targetLanguage],
    };

    try {
      const [response] = await translationClient.translateText(request);
      const translatedText = response.translations[0].translatedText;
      
      // Generate audio file
      const audioFileName = `${uuidv4()}.mp3`;
      const audioPath = join(__dirname, 'audio', audioFileName);
      
      console.log('Generating audio file:', audioPath);
      
      const gtts = new gTTS(translatedText, targetLanguage);
      await new Promise((resolve, reject) => {
        gtts.save(audioPath, (err) => {
          if (err) {
            console.error('Audio generation error:', err);
            reject(err);
          } else {
            resolve();
          }
        });
      });

      res.json({
        translation: translatedText,
        audioUrl: `/audio/${audioFileName}`,
        from: 'en',
        to: targetLanguage
      });
    } catch (error) {
      console.error('Translation error:', error);
      
      // If rate limit is exceeded, return a specific error
      if (error.message && error.message.includes('resource_exhausted')) {
        res.status(429).json({ 
          error: 'RATE_LIMIT_EXCEEDED',
          message: 'Translation API rate limit reached. Please try again in about an hour.'
        });
      } else {
        res.status(500).json({ 
          error: 'TRANSLATION_ERROR',
          message: 'Error performing translation. Please try again.' 
        });
      }
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: 'SERVER_ERROR',
      message: 'An unexpected error occurred. Please try again.' 
    });
  }
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Language Learning Translation API',
    note: 'Please set up Google Cloud credentials to use translation features'
  });
});

// Test route
app.get('/test', (req, res) => {
  res.json({ 
    status: 'Server is running',
    note: 'To use translation features, you need to set up Google Cloud credentials'
  });
});

app.get('/api/random-sentence', (req, res) => {
  const sentence = getRandomSentence();
  res.json({ sentence });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log(`Test the server: http://localhost:${port}/test`);
  console.log('\nIMPORTANT: Translation features require Google Cloud credentials');
  console.log('Please set up a Google Cloud project and configure the credentials');
});
