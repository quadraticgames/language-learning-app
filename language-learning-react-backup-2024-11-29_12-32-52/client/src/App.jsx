import { useState } from 'react';
import { Container, Select, Button, Paper, Box, Title, TextInput, Text, Loader, Collapse, Image } from '@mantine/core';
import axios from 'axios';

console.log('App.jsx is being imported');

const LANGUAGES = [
  { value: 'es', label: 'Spanish (Español)' },
  { value: 'fr', label: 'French (Français)' },
  { value: 'de', label: 'German (Deutsch)' }
];

const LANGUAGE_TIPS = {
  es: {
    key_sounds: [
      "Roll your 'r' sounds in words like 'perro' (dog)",
      "The 'h' is always silent in Spanish",
      "The 'ñ' sounds like 'ny' in 'canyon'"
    ],
    common_mistakes: [
      "Don't pronounce 'h' at the start of words",
      "The 'j' sounds like a strong 'h' in English",
      "Don't add 'e' before words starting with 's'"
    ]
  },
  fr: {
    key_sounds: [
      "Practice the nasal sounds: 'an', 'en', 'in', 'on'",
      "The 'r' is pronounced in the back of the throat",
      "The 'u' sound is made with rounded lips"
    ],
    common_mistakes: [
      "Don't pronounce final consonants (except c, r, f, l)",
      "Link words together (liaison) properly",
      "Keep intonation relatively flat"
    ]
  },
  de: {
    key_sounds: [
      "Practice the 'ü' sound (like 'ee' with rounded lips)",
      "The 'ch' after back vowels is like clearing throat",
      "The 'r' is pronounced in the back of the throat"
    ],
    common_mistakes: [
      "Don't forget to pronounce final consonants clearly",
      "The 'v' sounds like 'f' in most words",
      "The 'w' sounds like English 'v'"
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
                      {LANGUAGE_TIPS[targetLang].key_sounds.map((tip, index) => (
                        <Text component="li" c="gray.2" key={index} mb="xs">
                          {tip}
                        </Text>
                      ))}
                    </Box>

                    <Text fw={500} mb="xs" c="gray.4">Common Mistakes to Avoid:</Text>
                    <Box component="ul" ml="md" mb="md" sx={{ listStyleType: 'disc' }}>
                      {LANGUAGE_TIPS[targetLang].common_mistakes.map((tip, index) => (
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