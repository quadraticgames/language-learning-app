import { useState } from 'react';
import { Container, Select, Button, Paper, Box, Title, TextInput, Text, Loader, Collapse, Image } from '@mantine/core';
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
      "The 'st' at start of syllables is 'sht'",
      "The 'ie' sounds like 'ee' in 'see'"
    ],
    common_mistakes: [
      "Don't forget to pronounce final consonants clearly",
      "The 'v' sounds like 'f' in most words",
      "The 'w' sounds like English 'v'",
      "Don't pronounce 'ie' as separate sounds",
      "Don't skip the umlaut dots",
      "Don't pronounce 'j' like in English",
      "Don't ignore capitalization of nouns",
      "Don't pronounce 'ei' like 'ee'",
      "Don't pronounce 'ch' like 'k'",
      "Don't skip the glottal stop before vowels"
    ]
  },
  it: {
    key_sounds: [
      "Double consonants (gemination) are pronounced longer",
      "Roll your 'r' sounds distinctly",
      "The 'ch' is pronounced like 'k' in English",
      "The 'gh' is pronounced like 'g' in 'go'",
      "The 'gn' sounds like 'ny' in 'canyon'",
      "The 'gl + i' sounds like 'lli' in 'million'",
      "The 'sc' before 'i' or 'e' is 'sh'",
      "The 'z' can sound like 'ts' or 'dz'",
      "The 'c' before 'i' or 'e' is like 'ch' in 'cheese'",
      "Open and closed vowels are distinct"
    ],
    common_mistakes: [
      "Don't skip double consonants - they're important",
      "Stress usually falls on penultimate syllable",
      "The 'h' is always silent",
      "Don't pronounce final vowels too weakly",
      "Don't add vowels after final consonants",
      "Don't pronounce 'ch' as in English",
      "Don't skip the 'h' in 'ch' or 'gh'",
      "Don't pronounce 'gn' as two separate sounds",
      "Don't stress articles and prepositions",
      "Don't make all 'e' and 'o' sounds the same"
    ]
  },
  pt: {
    key_sounds: [
      "Nasal vowels with '~' like in 'não'",
      "The 'r' at start of words is like 'h'",
      "The 'lh' sounds like 'li' in 'million'",
      "The 'nh' sounds like 'ny' in 'canyon'",
      "The 'x' can have multiple sounds",
      "Closed vowels in unstressed positions",
      "The 'rr' is strongly rolled",
      "The 'ão' sound is unique to Portuguese",
      "The 'j' sounds like 'zh' in 'measure'",
      "The 'ç' sounds like 's' in 'simple'"
    ],
    common_mistakes: [
      "Don't pronounce 'ão' like 'ao'",
      "The 's' at end of words sounds like 'sh'",
      "Don't pronounce 'e' at end of words clearly",
      "Don't pronounce 'm' at end of words fully",
      "Don't skip nasal sounds",
      "Don't pronounce 'r' like in English",
      "Don't make all vowels strong",
      "Don't pronounce 'lh' as separate sounds",
      "Don't stress wrong syllables",
      "Don't pronounce 'x' always the same way"
    ]
  },
  nl: {
    key_sounds: [
      "The 'g' is pronounced with friction in throat",
      "The 'ui' sound is unique to Dutch",
      "The 'ij' sounds like 'ay' in 'say'",
      "The 'eu' has no English equivalent",
      "The 'oe' sounds like 'oo' in 'book'",
      "The 'sch' combination",
      "The 'ei' sounds like 'ay' in 'say'",
      "Final -n is often silent",
      "The 'aa' is longer than single 'a'",
      "The 'w' is softer than English 'w'"
    ],
    common_mistakes: [
      "Don't pronounce 'g' like in English",
      "The 'w' is softer than in English",
      "Don't skip the final 'n' in words",
      "Don't pronounce 'ui' as 'oo-ee'",
      "Don't pronounce 'ij' as 'i-j'",
      "Don't make 'ee' too short",
      "Don't pronounce 'oe' as two sounds",
      "Don't stress wrong syllables",
      "Don't pronounce 'ch' as in English",
      "Don't pronounce 'v' like 'f'"
    ]
  },
  ru: {
    key_sounds: [
      "Soft consonants with 'ь' are palatalized",
      "The 'ы' sound is unique to Russian",
      "Rolling 'р' sound",
      "The 'щ' is a soft 'sh' sound",
      "The 'ж' sounds like 's' in 'measure'",
      "Stressed vowels are longer",
      "The 'х' is like German 'ch'",
      "The 'л' can be soft or hard",
      "The 'ц' sounds like 'ts'",
      "Vowel reduction in unstressed positions"
    ],
    common_mistakes: [
      "Don't skip soft signs (ь)",
      "Distinguish between 'и' and 'ы'",
      "Proper stress is crucial for meaning",
      "Don't pronounce unstressed 'o' as 'oh'",
      "Don't skip final consonant devoicing",
      "Don't pronounce 'ь' as a vowel",
      "Don't make all 'л' sounds the same",
      "Don't skip vowel reduction",
      "Don't pronounce 'в' as English 'w'",
      "Don't stress every syllable equally"
    ]
  },
  zh: {
    key_sounds: [
      "Master the four tones - they change meaning",
      "The 'x' sound is like 'sh' but lighter",
      "The 'q' sound is like 'ch' but lighter",
      "The 'c' sounds like 'ts'",
      "The 'zh' sounds like 'j' in 'judge'",
      "The 'r' is similar to English 'r' but softer",
      "The 'e' sounds like 'uh'",
      "The 'ao' sounds like 'ow' in 'how'",
      "The 'ui' sounds like 'way'",
      "The 'ian' sounds like 'yen'"
    ],
    common_mistakes: [
      "Don't ignore tones - they change meaning",
      "The 'r' sound is different from English",
      "Don't add extra syllables",
      "Don't pronounce 'x' like English 'x'",
      "Don't pronounce 'q' like English 'q'",
      "Don't stress syllables unnecessarily",
      "Don't add vowels between consonants",
      "Don't skip the neutral tone",
      "Don't pronounce 'c' like English 'c'",
      "Don't blend syllables together"
    ]
  },
  ja: {
    key_sounds: [
      "All syllables are equal length",
      "The 'r' is between 'r' and 'l'",
      "Double consonants create a pause",
      "The 'u' is often silent between 's' and 'k'",
      "The 'f' sound is made with both lips",
      "The 'h' is slightly breathy",
      "The 'y' in 'kya' modifies the previous sound",
      "Long vowels are held twice as long",
      "The 'n' at the end of syllables is distinct",
      "The 'tsu' creates a brief pause"
    ],
    common_mistakes: [
      "Don't stress syllables",
      "Don't roll your 'r's",
      "Don't pronounce silent vowels",
      "Don't skip double consonants",
      "Don't add stress to any syllables",
      "Don't blend syllables together",
      "Don't pronounce 'h' too strongly",
      "Don't make vowels too long or short",
      "Don't add extra vowels at the end",
      "Don't pronounce 'f' with teeth"
    ]
  },
  ko: {
    key_sounds: [
      "Distinguish between aspirated and non-aspirated consonants",
      "The 'eo' sound is between 'uh' and 'oh'",
      "Double consonants are tenser",
      "The 'eu' sound has no English equivalent",
      "Final consonants are unreleased",
      "The 'ae' sound is like 'eh'",
      "The 'ng' sound can start syllables",
      "The 'w' sound in combinations",
      "The difference between 'o' and 'eo'",
      "Aspirated 'h' in combinations"
    ],
    common_mistakes: [
      "Don't mix up similar consonants",
      "Keep vowels pure and clear",
      "Don't add stress to syllables",
      "Don't release final consonants",
      "Don't pronounce silent consonants",
      "Don't skip double consonants",
      "Don't add extra sounds",
      "Don't stress any syllable",
      "Don't pronounce 'w' like English",
      "Don't mix up aspirated sounds"
    ]
  },
  hi: {
    key_sounds: [
      "Distinguish between aspirated and non-aspirated consonants",
      "The 'ṭ' and 'ḍ' are retroflex sounds",
      "The 'r' is tapped, not rolled",
      "The difference between dental and retroflex 't'",
      "The 'ṇ' is a retroflex nasal",
      "The 'ś' is like 'sh' in 'ship'",
      "The difference between 'ph' and 'f'",
      "The schwa sound deletion rules",
      "The 'ṛ' is a retroflex flap",
      "The distinction between 'v' and 'w'"
    ],
    common_mistakes: [
      "Don't ignore aspiration in consonants",
      "Distinguish between 'd' and 'ḍ'",
      "Don't stress wrong syllables",
      "Don't mix up retroflex and dental sounds",
      "Don't skip the schwa deletion",
      "Don't pronounce 'ph' as 'f'",
      "Don't mix aspirated consonants",
      "Don't ignore vowel length",
      "Don't pronounce 'r' like English",
      "Don't mix up 'v' and 'w'"
    ]
  },
  th: {
    key_sounds: [
      "Master the five tones",
      "Aspirated consonants are important",
      "Short and long vowels are distinct",
      "The 'ng' sound can start syllables",
      "The difference between aspirated and unaspirated pairs",
      "The 'r' sound is different from English",
      "The vowel length affects meaning",
      "The glottal stop at word ends",
      "The 'eu' vowel sound",
      "The difference between 'dt' and 't'"
    ],
    common_mistakes: [
      "Don't ignore tones - they change meaning",
      "Don't mix up similar consonants",
      "Keep vowel length distinct",
      "Don't skip final glottal stops",
      "Don't mix up aspirated sounds",
      "Don't stress syllables strongly",
      "Don't add extra vowels",
      "Don't ignore vowel length",
      "Don't pronounce silent letters",
      "Don't mix up similar tones"
    ]
  },
  vi: {
    key_sounds: [
      "Six tones are crucial for meaning",
      "The 'đ' sounds like 'd' in English",
      "Final consonants are unreleased",
      "The 'ư' sound is unique",
      "The difference between 'tr' and 'ch'",
      "The 'nh' sound like 'ny'",
      "The difference between 'ng' and 'ngh'",
      "The 'gi' sound variation",
      "The vowel combinations rules",
      "The difference between 'r' and 'g'"
    ],
    common_mistakes: [
      "Don't ignore tones",
      "Don't pronounce final consonants fully",
      "Keep vowels pure and clear",
      "Don't mix up similar consonants",
      "Don't stress syllables",
      "Don't add extra sounds",
      "Don't pronounce silent letters",
      "Don't mix up similar tones",
      "Don't skip diphthongs",
      "Don't pronounce 'đ' like 'd'"
    ]
  },
  ar: {
    key_sounds: [
      "The 'ع' (ayn) sound is unique to Arabic",
      "Distinguish between 'ح' and 'ه'",
      "The 'ق' is deep in the throat",
      "The emphatic consonants (ص، ط، ض، ظ)",
      "The glottal stop (hamza)",
      "The difference between 'س' and 'ص'",
      "The 'خ' sound like Scottish 'ch'",
      "Long vs short vowels",
      "The 'غ' is like French 'r'",
      "The sun and moon letters"
    ],
    common_mistakes: [
      "Don't skip throat sounds",
      "Distinguish between similar consonants",
      "Don't add vowels between consonants",
      "Don't ignore emphatic sounds",
      "Don't skip the hamza",
      "Don't mix up similar sounds",
      "Don't ignore vowel length",
      "Don't pronounce all 'h' sounds the same",
      "Don't skip the definite article rules",
      "Don't ignore final vowel marks"
    ]
  },
  tr: {
    key_sounds: [
      "Vowel harmony is crucial",
      "The 'ı' is different from 'i'",
      "The 'ğ' lengthens previous vowel",
      "The 'c' sounds like 'j' in 'jam'",
      "The difference between 'o' and 'ö'",
      "The difference between 'u' and 'ü'",
      "The 'ş' sounds like 'sh'",
      "The 'r' is tapped or trilled",
      "The 'y' is like English 'y'",
      "The 'z' is voiced"
    ],
    common_mistakes: [
      "Don't ignore vowel harmony",
      "Don't pronounce 'ğ' as a consonant",
      "Don't stress wrong syllables",
      "Don't pronounce 'c' like 'k'",
      "Don't mix up dotted and dotless i",
      "Don't skip the umlaut sounds",
      "Don't pronounce 'h' at end of syllables",
      "Don't add extra vowels",
      "Don't stress first syllable always",
      "Don't pronounce 'v' like English 'w'"
    ]
  },
  pl: {
    key_sounds: [
      "The 'ł' sounds like 'w' in English",
      "Nasal vowels 'ą' and 'ę'",
      "The 'sz' sounds like 'sh'",
      "The 'cz' sounds like 'ch'",
      "The 'rz' and 'ż' sound like 'zh'",
      "The 'ś' is a soft 'sh'",
      "The 'ć' is a soft 'ch'",
      "The 'ź' is a soft 'zh'",
      "The 'dz', 'dź', and 'dż' sounds",
      "The difference between 'l' and 'ł'"
    ],
    common_mistakes: [
      "Don't pronounce 'ł' like 'l'",
      "Keep consonant clusters clear",
      "Don't skip nasal vowels",
      "Don't mix up sz/ś, cz/ć, ż/ź",
      "Don't add vowels between consonants",
      "Don't stress wrong syllables",
      "Don't pronounce 'w' like English 'w'",
      "Don't ignore soft consonants",
      "Don't skip the 'y' sound",
      "Don't pronounce 'ó' like 'o'"
    ]
  },
  sv: {
    key_sounds: [
      "The 'sj' sound is unique",
      "Long and short vowels differ in quality",
      "The melody pattern is important",
      "The 'tj' sound is unique",
      "The difference between 'o' and 'å'",
      "The 'u' sound is unique",
      "The difference between 'ä' and 'e'",
      "The 'k' before front vowels",
      "The 'g' before front vowels",
      "The 'rs' combination"
    ],
    common_mistakes: [
      "Don't ignore pitch accent",
      "Don't pronounce 'u' like 'oo'",
      "Don't mix up 'å', 'ä', and 'ö'",
      "Don't skip the melody",
      "Don't pronounce 'k' always hard",
      "Don't pronounce 'g' always hard",
      "Don't stress wrong syllables",
      "Don't ignore vowel length",
      "Don't pronounce 'j' like English 'j'",
      "Don't skip compound word stress"
    ]
  },
  el: {
    key_sounds: [
      "The 'γ' varies with following vowel",
      "The 'θ' is like 'th' in 'think'",
      "The 'χ' is like German 'ch'",
      "The 'δ' is like 'th' in 'this'",
      "The 'ου' sounds like 'oo'",
      "The 'αι' sounds like 'e' in 'pet'",
      "The 'μπ' sounds like 'b'",
      "The 'ντ' sounds like 'd'",
      "The 'γκ' sounds like 'g'",
      "The stress accent is important"
    ],
    common_mistakes: [
      "Don't pronounce 'γ' always the same",
      "Don't pronounce 'υ' like English 'y'",
      "Don't stress wrong syllables",
      "Don't pronounce 'η' like 'h'",
      "Don't pronounce 'β' like 'b'",
      "Don't skip diphthongs",
      "Don't pronounce 'ω' differently from 'ο'",
      "Don't add aspiration to consonants",
      "Don't pronounce 'γ' like English 'g'",
      "Don't ignore stress marks"
    ]
  }
};

function App() {
  console.log('App component is being initialized');
  const [text, setText] = useState('');
  const [targetLang, setTargetLang] = useState('es');
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [error, setError] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [showTips, setShowTips] = useState(false);
  const [currentTips, setCurrentTips] = useState({ key_sounds: [], common_mistakes: [] });

  const handleRandomSentence = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/random-sentence');
      setText(response.data.sentence);
    } catch (err) {
      console.error('Error fetching random sentence:', err);
      setError('Failed to get random sentence');
    }
  };

  const handleTranslate = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    setAudioLoading(true);
    setError(null);
    setTranslation('');
    setAudioUrl(null);
    setShowTips(false);
    
    try {
      console.log('Sending translation request:', { text, targetLang });
      
      const response = await axios.post('http://localhost:5000/api/translate', {
        text,
        targetLanguage: targetLang
      });
      
      if (response.data.translation) {
        setTranslation(response.data.translation);
        if (response.data.audioUrl) {
          setAudioUrl(`http://localhost:5000${response.data.audioUrl}`);
        }
        
        // Get random tips for the selected language
        const tips = LANGUAGE_TIPS[targetLang];
        setCurrentTips({
          key_sounds: getRandomItems(tips.key_sounds, 3),
          common_mistakes: getRandomItems(tips.common_mistakes, 3)
        });
        setShowTips(true);
      } else {
        throw new Error('No translation received from server');
      }
    } catch (err) {
      console.error('Translation error:', err);
      setError(err.response?.data?.error || err.message || 'Translation failed');
    } finally {
      setLoading(false);
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
                
                {audioLoading && !audioUrl && (
                  <Box ta="center" py="md">
                    <Loader size="sm" />
                    <Text size="sm" c="dimmed" mt="xs">
                      Generating audio pronunciation...
                    </Text>
                  </Box>
                )}
                
                {audioUrl && (
                  <Box mb="lg">
                    <Text fw={500} mb="xs" c="gray.3">Pronunciation:</Text>
                    <audio 
                      controls 
                      src={audioUrl}
                      style={{ width: '100%', marginTop: '0.5rem' }}
                    />
                  </Box>
                )}

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