# AI-Powered Multilingual Translator

A Next.js application that leverages Google Gemini AI for high-quality language translations and text-to-speech capabilities.

## Features

- Translate text between multiple languages using Google Gemini AI
- Text-to-speech functionality using browser's built-in speech synthesis
- Copy translated text to clipboard
- Swap languages easily
- Modern UI with dark mode support

## Technologies Used

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Google Generative AI (Gemini)
- Browser Web Speech API

## Getting Started

### Prerequisites

- Node.js 18+
- NPM or Yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Pushkaraj-Palli/AWS-Translation.git
   cd AWS-Translation
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env.local` file in the root directory and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. Select source and target languages from the dropdown menus
2. Enter text to translate in the input field
3. Click "Translate" to convert the text
4. Use the speaker icons to hear the pronunciation
5. Copy the translated text using the copy button

## Fallback Mechanisms

The application implements multiple fallback mechanisms for translation:
1. Primary: Google Gemini API
2. Fallback: LibreTranslate API (free, open-source translation service)
3. Last resort: Simple dictionary for common phrases

## License

This project is licensed under the MIT License - see the LICENSE file for details. 