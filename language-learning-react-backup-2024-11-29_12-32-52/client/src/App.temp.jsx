import { useState } from 'react';
import { MantineProvider, Container, Select, Button, Paper, Text, Box, Title, Textarea } from '@mantine/core';
import axios from 'axios';

const LANGUAGES = [
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'ja', label: 'Japanese' }
];

function App() {
  const [text, setText] = useState('');
  const [targetLang, setTargetLang] = useState('es');
  const [translation, setTranslation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!text) return;
    
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/translate', {
        text,
        targetLang
      });
      
      setTranslation(response.data);
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={{
      colorScheme: 'dark',
      primaryColor: 'indigo',
      fontFamily: 'Poppins, sans-serif'
    }}>
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#1a1a1a',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '600px',
            margin: '0 auto'
          }}
        >
          <Title 
            order={1} 
            align="center"
            mb={40}
            sx={{ color: '#ffffff' }}
          >
            Language Learning Assistant
          </Title>

          <Paper 
            p="xl" 
            radius="md"
            sx={{
              backgroundColor: '#2d2d2d'
            }}
          >
            <Textarea
              label="Enter text to translate"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type something..."
              minRows={3}
              mb="md"
              styles={{
                input: {
                  backgroundColor: '#1a1a1a'
                }
              }}
            />

            <Select
              label="Target Language"
              value={targetLang}
              onChange={setTargetLang}
              data={LANGUAGES}
              mb="xl"
              styles={{
                input: {
                  backgroundColor: '#1a1a1a'
                }
              }}
            />

            <Button
              onClick={handleTranslate}
              loading={loading}
              fullWidth
              size="lg"
              sx={{
                backgroundColor: '#4f46e5',
                '&:hover': {
                  backgroundColor: '#4338ca'
                }
              }}
            >
              Translate
            </Button>

            {translation && (
              <Box mt="xl">
                <Text weight={500} mb="xs" color="white">Translation:</Text>
                <Text mb="lg" size="xl" color="white">{translation.translation}</Text>

                {translation.audioUrl && (
                  <Box mb="lg">
                    <Text weight={500} mb="xs" color="white">Pronunciation:</Text>
                    <audio
                      controls
                      src={`http://localhost:5000${translation.audioUrl}`}
                      style={{ width: '100%' }}
                    />
                  </Box>
                )}

                {translation.examples?.length > 0 && (
                  <Box>
                    <Text weight={500} mb="xs" color="white">Example Usage:</Text>
                    {translation.examples.map((example, index) => (
                      <Text 
                        key={index} 
                        mb="xs"
                        p="sm"
                        sx={{
                          backgroundColor: '#1a1a1a',
                          borderRadius: '4px',
                          color: 'white'
                        }}
                      >
                        {example}
                      </Text>
                    ))}
                  </Box>
                )}
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </MantineProvider>
  );
}

export default App;
