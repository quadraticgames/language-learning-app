console.log('Starting main.jsx');

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import App from './App';

console.log('Imports completed');

const theme = createTheme({
  colorScheme: 'dark',
  primaryColor: 'blue',
  components: {
    Title: {
      styles: {
        root: { color: '#fff' }
      }
    },
    TextInput: {
      styles: {
        label: { color: '#C1C2C5' },
        input: { backgroundColor: '#25262B', color: '#C1C2C5' }
      }
    },
    Select: {
      styles: {
        label: { color: '#C1C2C5' },
        input: { backgroundColor: '#25262B', color: '#C1C2C5' }
      }
    }
  }
});

try {
  const root = document.getElementById('root');
  console.log('Root element found:', root);
  
  if (root) {
    const rootInstance = createRoot(root);
    rootInstance.render(
      <StrictMode>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <App />
        </MantineProvider>
      </StrictMode>
    );
    console.log('React rendering attempted');
  }
} catch (error) {
  console.error('Error in main.jsx:', error);
}
