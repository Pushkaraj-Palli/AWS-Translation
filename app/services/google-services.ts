"use server"

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google API key
// In production, this should be an environment variable
// const googleApiKey = process.env.GEMINI_API_KEY || "";
const googleApiKey = "AIzaSyDb9rVI4WVyYgujG364E0ie-6GIJjmhtRk";

// Initialize Google Generative AI (Gemini)
// Update to use the correct API version
const genAI = new GoogleGenerativeAI(googleApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Language mapping for translation fallback
const languageCodes: Record<string, string> = {
  en: 'en',
  es: 'es',
  fr: 'fr',
  de: 'de',
  it: 'it',
  pt: 'pt',
  ru: 'ru',
  zh: 'zh-CN',
  ja: 'ja',
  ko: 'ko',
  ar: 'ar',
  hi: 'hi',
  nl: 'nl',
  sv: 'sv',
  fi: 'fi',
  da: 'da',
  no: 'no',
  pl: 'pl',
  tr: 'tr',
  he: 'he',
  id: 'id',
  th: 'th',
  cs: 'cs',
  el: 'el',
  ro: 'ro',
  sk: 'sk',
  uk: 'uk',
  vi: 'vi',
};

/**
 * Directly translate text using Gemini AI
 */
export async function geminiTranslateText(text: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
  try {
    // Simple prompt to translate text
    const prompt = `
    Translate the following text from ${sourceLanguage} to ${targetLanguage}:
    
    "${text}"
    
    Return ONLY the translation without any explanations or additional text.
    `;
    
    const result = await model.generateContent(prompt);
    const translation = result.response.text().trim();
    
    if (!translation) {
      throw new Error("Empty translation result");
    }
    
    return translation;
  } catch (error) {
    console.error("Gemini translation error:", error);
    
    // First fallback: Try the browser translation API
    try {
      const result = await browserFallbackTranslation(text, sourceLanguage, targetLanguage);
      console.log("Using LibreTranslate fallback");
      return result;
    } catch (fallbackError) {
      console.error("Fallback translation error:", fallbackError);
      
      // Second fallback: Try simple dictionary translations
      return simpleTranslation(text, targetLanguage);
    }
  }
}

/**
 * Simple fallback translation for common phrases
 */
function simpleTranslation(text: string, targetLanguage: string): string {
  // A very basic fallback for when everything else fails
  const commonPhrases: Record<string, Record<string, string>> = {
    "hello": {
      es: "hola",
      fr: "bonjour",
      de: "hallo",
      it: "ciao",
      zh: "你好",
      ja: "こんにちは",
      ru: "привет"
    },
    "thank you": {
      es: "gracias",
      fr: "merci",
      de: "danke",
      it: "grazie",
      zh: "谢谢",
      ja: "ありがとう",
      ru: "спасибо"
    },
    "goodbye": {
      es: "adiós",
      fr: "au revoir",
      de: "auf wiedersehen",
      it: "arrivederci",
      zh: "再见",
      ja: "さようなら",
      ru: "до свидания"
    }
  };

  const lowerText = text.toLowerCase();
  
  // Check if the text matches any common phrase
  for (const phrase in commonPhrases) {
    if (lowerText === phrase) {
      const translations = commonPhrases[phrase];
      if (translations[targetLanguage]) {
        return translations[targetLanguage];
      }
    }
  }
  
  // If no match is found, just return the original text
  return `${text} (translation unavailable)`;
}

/**
 * Attempt to use a browser-based translation service as fallback
 * This uses a public translation API that doesn't require API keys
 */
async function browserFallbackTranslation(text: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
  try {
    // Map language codes to what the API expects
    const sourceLang = languageCodes[sourceLanguage] || sourceLanguage;
    const targetLang = languageCodes[targetLanguage] || targetLanguage;
    
    // Using LibreTranslate public API as a fallback
    const response = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Translation API returned status ${response.status}`);
    }
    
    const data = await response.json();
    if (data && data.translatedText) {
      return data.translatedText;
    } else {
      throw new Error('Invalid response from translation API');
    }
  } catch (error) {
    console.error('Browser fallback translation error:', error);
    throw error;
  }
}

// For compatibility with the existing code structure
export async function googleTranslateText(text: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
  // Just use Gemini for everything since the Google Translation API is not enabled
  return geminiTranslateText(text, sourceLanguage, targetLanguage);
}

// Legacy function for handling the case when both translation services fail
export async function directGeminiTranslation(text: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
  return geminiTranslateText(text, sourceLanguage, targetLanguage);
}

/**
 * Generate speech using the browser's built-in Text-to-Speech API
 * This is a client-side function that will be called from the browser
 */
export async function googleSynthesizeSpeech(text: string, languageCode: string): Promise<string> {
  try {
    // Since the Google TTS API isn't working, we'll return a placeholder
    // that will trigger the browser's built-in TTS
    return "browser-tts://" + encodeURIComponent(text) + "?lang=" + languageCode;
  } catch (error) {
    console.error("Speech synthesis error:", error);
    throw new Error("Failed to set up speech synthesis");
  }
} 