"use server"

import { geminiTranslateText } from "./services/google-services"

// Service type for different translation providers - now just using Gemini variants
export type TranslationService = "google" | "gemini";

// Main translation function that routes to the appropriate service
export async function translateText(
  text: string, 
  sourceLanguage: string, 
  targetLanguage: string,
  service: TranslationService = "gemini" // Default to gemini for best quality
): Promise<string> {
  try {
    // Now we only use geminiTranslateText for all translations
    return await geminiTranslateText(text, sourceLanguage, targetLanguage);
  } catch (error) {
    console.error("Translation error:", error);
    
    // Provide a more user-friendly error message
    if (error instanceof Error) {
      throw new Error(`Translation failed: ${error.message}`);
    }
    
    throw new Error("Translation failed. Please try again.");
  }
}
