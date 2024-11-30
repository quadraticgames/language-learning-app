import { useState } from 'react';
import { Container, Select, Button, Paper, Box, Title, TextInput, Text, Loader, Collapse, Audio } from '@mantine/core';
import axios from 'axios';

console.log('App.jsx is being imported');

const LANGUAGES = [
  // European Languages
  { value: 'es', label: 'Spanish (Español)' },
  { value: 'fr', label: 'French (Français)' },
  { value: 'de', label: 'German (Deutsch)' },
  { value: 'it', label: 'Italian (Italiano)' },
  { value: 'pt', label: 'Portuguese (Português)' },
  { value: 'nl', label: 'Dutch (Nederlands)' },
  { value: 'ru', label: 'Russian (Русский)' },
  
  // Asian Languages
  { value: 'zh', label: 'Chinese (中文)' },
  { value: 'ja', label: 'Japanese (日本語)' },
  { value: 'ko', label: 'Korean (한국어)' },
  { value: 'hi', label: 'Hindi (हिन्दी)' },
  { value: 'th', label: 'Thai (ไทย)' },
  { value: 'vi', label: 'Vietnamese (Tiếng Việt)' },
  
  // Other Major Languages
  { value: 'ar', label: 'Arabic (العربية)' },
  { value: 'tr', label: 'Turkish (Türkçe)' },
  { value: 'pl', label: 'Polish (Polski)' },
  { value: 'sv', label: 'Swedish (Svenska)' },
  { value: 'el', label: 'Greek (Ελληνικά)' }
];

// Function to get random items from array
const getRandomItems = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const LANGUAGE_TIPS = {
  es: {
    key_sounds: [
      "Roll your 'r' sounds in words like 'perro' (dog)",
      "The 'h' is always silent in Spanish",
      "The 'ñ' sounds like 'ny' in 'canyon'",
      "The 'j' sounds like a strong 'h' as in 'jamón'",
      "The 'll' sounds like 'y' in 'yellow'",
      "The 'z' is pronounced like 'th' in 'think' (in Spain)",
      "The 'b' and 'v' sound almost identical",
      "The 'c' before 'e' and 'i' sounds like 'th' (in Spain)",
      "The 'gu' before 'e' and 'i' sounds like 'g' in 'get'",
      "The 'd' between vowels is softer than in English"
    ],
    common_mistakes: [
      "Don't pronounce 'h' at the start of words",
      "The 'j' sounds like a strong 'h' in English",
      "Don't add 'e' before words starting with 's'",
      "Don't pronounce 'll' like an 'l'",
      "Don't pronounce 'v' differently from 'b'",
      "Don't skip rolling your 'r's when required",
      "Don't pronounce 'e' like the English 'ay'",
      "Don't pronounce final 'd' like 't'",
      "Don't stress the wrong syllable",
      "Don't pronounce 'i' like the English 'eye'"
    ]
  },
  fr: {
    key_sounds: [
      "Practice the nasal sounds: 'an', 'en', 'in', 'on'",
      "The 'r' is pronounced in the back of the throat",
      "The 'u' sound is made with rounded lips",
      "Silent letters at the end of words",
      "The 'ou' sounds like 'oo' in 'food'",
      "The 'ai' sounds like 'e' in 'bed'",
      "The 'oi' sounds like 'wa' in 'water'",
      "The 'gn' sounds like 'ny' in 'canyon'",
      "The 'è' sounds like 'e' in 'bed'",
      "The 'eu' has no English equivalent"
    ],
    common_mistakes: [
      "Don't pronounce final consonants (except c, r, f, l)",
      "Link words together (liaison) properly",
      "Keep intonation relatively flat",
      "Don't pronounce 'h' at the start of words",
      "Don't add English 'r' sound at the end of words",
      "Don't pronounce all written vowels separately",
      "Don't skip the liaison between words",
      "Don't stress syllables too strongly",
      "Don't pronounce 'th' like in English",
      "Don't make 'u' sound like 'oo'"
    ]
  },
  de: {
    key_sounds: [
      "Practice the 'ü' sound (like 'ee' with rounded lips)",
      "The 'ch' after back vowels is like clearing throat",
      "The 'r' is pronounced in the back of the throat",
      "The 'ö' sound (like 'e' with rounded lips)",
      "The 'ei' sounds like 'eye'",
      "The 'ä' sounds like 'e' in 'bed'",
      "The 'z' sounds like 'ts'",
      "The 'w' sounds like English 'v'",
      "The 'v' sounds like English 'f'",
      "The 'j' sounds like English 'y'"
    ],
    common_mistakes: [
      "Don't pronounce 'w' like in English",
      "Don't skip the umlaut sounds",
      "Don't pronounce 'v' like in English",
      "Don't pronounce 'z' like in English",
      "Don't ignore word stress",
      "Don't pronounce 'ch' like 'k'",
      "Don't pronounce 'j' like in English",
      "Don't pronounce 'ei' like 'ee'",
      "Don't pronounce 'ie' like 'eye'",
      "Don't ignore case in nouns"
    ]
  },
  it: {
    key_sounds: [
      "The 'c' before 'i' or 'e' is pronounced like 'ch' in 'cheese'",
      "Double consonants are pronounced longer (e.g., 'pizza')",
      "The 'r' is rolled, similar to Spanish",
      "The 'gn' combination sounds like 'ñ' in Spanish"
    ],
    common_mistakes: [
      "Don't pronounce the 'h' - it's always silent",
      "The 'sc' before 'i' or 'e' sounds like 'sh'",
      "Stress usually falls on the second-to-last syllable",
      "The 'z' sound is pronounced 'ts' or 'dz'"
    ]
  },
  ja: {
    key_sounds: [
      "Vowels are pronounced consistently and purely",
      "The 'r' sound is between 'r' and 'l' in English",
      "Each syllable has equal length (mora-timed)",
      "Pay attention to the pitch accent in words"
    ],
    common_mistakes: [
      "Don't stress syllables like in English",
      "Keep consonants crisp and short",
      "Don't add extra vowels to consonant endings",
      "Maintain consistent pitch within phrases"
    ]
  },
  zh: {
    key_sounds: [
      "Master the four tones - they change word meaning",
      "The 'x' sound is like 'sh' but with tongue down",
      "The 'q' sound is like 'ch' but lighter",
      "Practice the 'zh', 'ch', 'sh' distinctions"
    ],
    common_mistakes: [
      "Don't ignore tone changes in combinations",
      "Keep final consonants very light or silent",
      "Avoid adding extra syllables",
      "Don't stress words like in English"
    ]
  },
  ko: {
    key_sounds: [
      "Distinguish between aspirated and non-aspirated consonants",
      "The 'eo' sound is between 'uh' and 'oh'",
      "The 'eu' sound is similar to 'uh' but with rounded lips",
      "Practice double consonants (tensed sounds)"
    ],
    common_mistakes: [
      "Don't pronounce silent consonants at syllable ends",
      "Keep vowels pure and consistent",
      "Pay attention to word-final intonation",
      "Maintain proper syllable timing"
    ]
  },
  pt: {
    key_sounds: [
      "The 'ão' sound is a nasalized 'ow'",
      "The 'lh' sounds like 'li' in 'million'",
      "The 'r' at start of words is rolled",
      "Practice nasal vowels (ã, õ, etc.)"
    ],
    common_mistakes: [
      "Don't pronounce final 's' as 'z'",
      "Keep vowels pure and consistent",
      "Pay attention to open vs closed vowels",
      "Don't skip the nasal sounds"
    ]
  },
  ru: {
    key_sounds: [
      "The 'ы' sound is unique - practice extensively",
      "Soft consonants are palatalized",
      "The 'р' (r) is rolled",
      "Stress changes vowel pronunciation significantly"
    ],
    common_mistakes: [
      "Don't skip vowel reduction in unstressed syllables",
      "Practice proper consonant softening",
      "Pay attention to word stress",
      "Keep hard consonants truly hard"
    ]
  },
  ar: {
    key_sounds: [
      "Master throat sounds (ع، ح، خ، غ)",
      "Distinguish between emphatic consonants",
      "The 'ع' has no English equivalent",
      "Long vs short vowels are important"
    ],
    common_mistakes: [
      "Don't skip the glottal stops (hamza)",
      "Maintain proper vowel length",
      "Practice sun and moon letter assimilation",
      "Keep emphatic consonants distinct"
    ]
  },
  hi: {
    key_sounds: [
      "Distinguish between aspirated and unaspirated consonants",
      "The 'ṭ' and 'ḍ' are retroflex sounds",
      "Practice the difference between 'द' and 'ड'",
      "Master the schwa deletion rules"
    ],
    common_mistakes: [
      "Don't skip retroflexion in proper sounds",
      "Keep aspirated consonants properly aspirated",
      "Maintain proper vowel length",
      "Pay attention to word stress patterns"
    ]
  },
  vi: {
    key_sounds: [
      "Master the six tones - they change word meaning",
      "The 'đ' sounds like 'd' in English",
      "Practice final consonant sounds",
      "Distinguish between similar vowels"
    ],
    common_mistakes: [
      "Don't ignore tone changes",
      "Keep final consonants very light",
      "Maintain proper vowel length",
      "Practice proper glottal stops"
    ]
  },
  nl: {
    key_sounds: [
      "The 'g' is a throaty sound",
      "The 'ui' sound is unique - practice extensively",
      "The 'ij' sounds like 'ay' in 'say'",
      "Practice the 'eu' sound"
    ],
    common_mistakes: [
      "Don't pronounce 'g' like in English",
      "Keep vowels pure and consistent",
      "Practice proper diphthongs",
      "Pay attention to word-final devoicing"
    ]
  }
};

function App() {
  console.log('App component is being initialized');
  const [text, setText] = useState('');
  const [targetLang, setTargetLang] = useState('es');
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTips, setShowTips] = useState(false);
  const [currentTips, setCurrentTips] = useState({ key_sounds: [], common_mistakes: [] });
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioLoading, setAudioLoading] = useState(false);

  const handleRandomSentence = async () => {
    try {
      console.log('Starting random sentence request...');
      setError(null);
      setTranslation(''); // Clear translation
      setShowTips(false); // Hide tips
      setCurrentTips({ key_sounds: [], common_mistakes: [] }); // Clear tips
      setAudioUrl(null); // Clear audio
      const response = await axios.get('/.netlify/functions/random-sentence');
      console.log('Random sentence API response:', response);
      
      if (response.data && response.data.sentence) {
        console.log('Setting sentence:', response.data.sentence);
        setText(response.data.sentence);
      } else {
        console.error('Invalid response format:', response.data);
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching random sentence:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response,
        request: err.request
      });
      setError('Failed to get random sentence. Please try again.');
    }
  };

  const handleTranslate = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    setError(null);
    setTranslation('');
    setShowTips(false);
    setCurrentTips({ key_sounds: [], common_mistakes: [] }); // Clear tips
    setAudioUrl(null); // Clear audio
    
    try {
      console.log('Sending translation request:', { text, targetLang });
      
      // First get the translation
      const translationResponse = await axios.post('/.netlify/functions/translate', {
        text,
        targetLanguage: targetLang
      });
      
      console.log('Translation response:', translationResponse.data);
      
      if (translationResponse.data && translationResponse.data.translation) {
        const translatedText = translationResponse.data.translation;
        setTranslation(translatedText);
        
        // Get random tips for the selected language
        if (LANGUAGE_TIPS && LANGUAGE_TIPS[targetLang]) {
          const tips = LANGUAGE_TIPS[targetLang];
          setCurrentTips({
            key_sounds: getRandomItems(tips.key_sounds || [], 3),
            common_mistakes: getRandomItems(tips.common_mistakes || [], 3)
          });
          setShowTips(true);
        }
        
        // Immediately request audio for the translation
        setAudioLoading(true);
        try {
          const audioResponse = await axios.post('/.netlify/functions/text-to-speech', {
            text: translatedText,
            languageCode: targetLang
          });
          
          if (audioResponse.data && audioResponse.data.audioContent) {
            const blob = new Blob(
              [Uint8Array.from(atob(audioResponse.data.audioContent), c => c.charCodeAt(0))],
              { type: 'audio/mp3' }
            );
            const url = URL.createObjectURL(blob);
            setAudioUrl(url);
          }
        } catch (audioErr) {
          console.error('Text-to-speech error:', audioErr);
          setError('Audio generation failed, but translation is available.');
        } finally {
          setAudioLoading(false);
        }
      } else {
        console.error('Invalid translation response:', translationResponse.data);
        throw new Error('Invalid translation response format');
      }
    } catch (err) {
      console.error('Translation error:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(
        err.response?.data?.error || 
        err.response?.data?.details || 
        'Translation failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTextToSpeech = async () => {
    if (!translation) return;
    
    setAudioLoading(true);
    try {
      const response = await axios.post('/.netlify/functions/text-to-speech', {
        text: translation,
        languageCode: targetLang
      });
      
      if (response.data && response.data.audioContent) {
        // Convert base64 to blob and create URL
        const blob = new Blob(
          [Uint8Array.from(atob(response.data.audioContent), c => c.charCodeAt(0))],
          { type: 'audio/mp3' }
        );
        const url = URL.createObjectURL(blob);
        
        // Clean up previous audio URL if it exists
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }
        
        setAudioUrl(url);
      }
    } catch (err) {
      console.error('Text-to-speech error:', err);
      setError('Failed to generate speech. Please try again.');
    } finally {
      setAudioLoading(false);
    }
  };

  return (
    <Box bg="dark.7" sx={{ minHeight: '100vh' }}>
      <Container size="md" py="3rem">
        <Box ta="center" mb="xl">
          <img 
            src="/app-icon.png" 
            alt="Language Learning Assistant" 
            style={{ 
              width: '120px', 
              height: '120px',
              marginBottom: '1rem',
              borderRadius: '20px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            }} 
          />
          <Title order={1} mb="md" ta="center">
            Language Learning Translation Assistant
          </Title>
          <Text c="dimmed" size="lg" mb="xl" ta="center">
            Translate text, hear pronunciations, and learn language-specific tips
          </Text>
        </Box>
        <Paper p="xl" radius="md" bg="dark.6" withBorder>
          <Select
            value={targetLang}
            onChange={(value) => {
              setTargetLang(value);
              setShowTips(false);
            }}
            data={LANGUAGES}
            label="Select Language"
            placeholder="Choose a language"
            mb="md"
          />
          <TextInput
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to translate"
            label="Text to Translate"
            mb="md"
          />
          <Button 
            variant="light"
            color="gray"
            fullWidth
            mb="md"
            onClick={handleRandomSentence}
            leftSection={<Text size="1.1rem">🎲</Text>}
          >
            Generate Random Sentence
          </Button>
          <Button 
            fullWidth 
            variant="filled" 
            color="blue"
            onClick={handleTranslate}
            disabled={!text.trim() || loading}
            leftSection={loading ? <Loader size="sm" color="white" /> : <Text size="1.1rem">🌍</Text>}
          >
            {loading ? 'Translating...' : 'Translate'}
          </Button>

          {error && (
            <Paper p="md" mt="md" radius="md" bg="red.9">
              <Text c="white" ta="center">
                {error}
              </Text>
            </Paper>
          )}

          {translation && (
            <Box mt="xl">
              <Paper p="lg" radius="md" bg="dark.5" withBorder>
                <Text fw={500} mb="xs" c="gray.3">Translation:</Text>
                <Text size="lg" mb="lg">{translation}</Text>

                <Box mb="lg">
                  {audioLoading ? (
                    <Box ta="center" mt="md">
                      <Loader size="sm" />
                      <Text size="sm" c="dimmed" mt="xs">Generating audio...</Text>
                    </Box>
                  ) : audioUrl && (
                    <Box mt="md">
                      <audio controls src={audioUrl} style={{ width: '100%' }} />
                    </Box>
                  )}
                </Box>

                <Collapse in={showTips}>
                  <Box>
                    <Text fw={500} size="lg" mb="md" c="gray.3">
                      Pronunciation Tips for {LANGUAGES.find(l => l.value === targetLang)?.label}:
                    </Text>
                    
                    <Text fw={500} mb="xs" c="gray.4">Key Sounds:</Text>
                    <Box component="ul" ml="md" mb="md" sx={{ listStyleType: 'disc' }}>
                      {currentTips.key_sounds.map((tip, index) => (
                        <Text component="li" c="gray.2" key={index} mb="xs">
                          {tip}
                        </Text>
                      ))}
                    </Box>

                    <Text fw={500} mb="xs" c="gray.4">Common Mistakes to Avoid:</Text>
                    <Box component="ul" ml="md" mb="md" sx={{ listStyleType: 'disc' }}>
                      {currentTips.common_mistakes.map((tip, index) => (
                        <Text component="li" c="gray.2" key={index} mb="xs">
                          {tip}
                        </Text>
                      ))}
                    </Box>
                  </Box>
                </Collapse>
              </Paper>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default App;
