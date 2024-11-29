# Language Learning Translation App 🌍

A comprehensive multilingual translation and learning platform built with React and Express.js. Features real-time translation, pronunciation guides, and text-to-speech capabilities across 18 languages.

## ✨ Features

- 🔤 Support for 18 languages across different regions
- 🗣️ Text-to-speech pronunciation
- 📝 Real-time translation
- 💡 Language-specific pronunciation tips
- 🎲 Random practice sentences
- 🌙 Dark theme UI
- 📱 Responsive design

## 🌐 Supported Languages

### European Languages
- Spanish (Español)
- French (Français)
- German (Deutsch)
- Italian (Italiano)
- Portuguese (Português)
- Dutch (Nederlands)
- Russian (Русский)
- Polish (Polski)
- Swedish (Svenska)
- Greek (Ελληνικά)

### Asian Languages
- Chinese (中文)
- Japanese (日本語)
- Korean (한국어)
- Hindi (हिन्दी)
- Thai (ไทย)
- Vietnamese (Tiếng Việt)

### Other Major Languages
- Arabic (العربية)
- Turkish (Türkçe)

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Google Cloud Translation API credentials

### Installation

1. Clone the repository:
```bash
git clone https://github.com/quadraticgames/language-learning-app.git
cd language-learning-app
```

2. Install dependencies for both client and server:
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Set up Google Cloud credentials:
- Create a project in Google Cloud Console
- Enable the Cloud Translation API
- Create a service account and download the credentials JSON
- Place the credentials file in `server/config/google-credentials.json`

4. Start the development servers:

In the server directory:
```bash
npm run dev
```

In the client directory:
```bash
npm run dev
```

The client will run on `http://localhost:5173` and the server on `http://localhost:5000`.

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- Mantine UI v7
- Axios

### Backend
- Express.js
- Google Cloud Translation API
- gTTS (Google Text-to-Speech)
- CORS

## 🎯 Key Features

### Translation
- Real-time text translation
- Support for 18 languages
- Error handling and rate limiting
- Loading states and fallback mechanisms

### Pronunciation
- Text-to-speech functionality
- Language-specific pronunciation tips
- Random practice sentences
- Audio playback controls

### User Interface
- Dark theme with high contrast
- Responsive design
- Language selection dropdown
- Clean, minimal interface
- Loading indicators

## 📝 Development

### Project Structure
```
language-learning-react/
├── client/                 # React frontend
│   ├── public/            # Static files
│   └── src/               # Source files
├── server/                # Express backend
│   ├── config/           # Configuration files
│   └── data/             # Data files
└── README.md
```

### Environment Variables
Create a `.env` file in the server directory:
```env
PORT=5000
GOOGLE_APPLICATION_CREDENTIALS=./config/google-credentials.json
```

## 🔒 Security

- Server-side API key handling
- Rate limiting
- CORS configuration
- Input validation
- Error message sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google Cloud Translation API
- Mantine UI
- React community
- Open source contributors