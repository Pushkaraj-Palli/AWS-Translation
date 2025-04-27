"use server"

import { TranslateClient, TranslateTextCommand } from "@aws-sdk/client-translate"
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly"
import { getLanguageVoice } from "@/lib/languages"

// Initialize AWS clients
const translateClient = new TranslateClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const pollyClient = new PollyClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function translateText(text: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
  try {
    const command = new TranslateTextCommand({
      Text: text,
      SourceLanguageCode: sourceLanguage,
      TargetLanguageCode: targetLanguage,
    })

    const response = await translateClient.send(command)
    return response.TranslatedText || ""
  } catch (error) {
    console.error("Translation error:", error)
    throw new Error("Failed to translate text")
  }
}

export async function synthesizeSpeech(text: string, languageCode: string): Promise<string> {
  try {
    const voice = getLanguageVoice(languageCode)
    const command = new SynthesizeSpeechCommand({
      Text: text,
      VoiceId: voice as any,
      OutputFormat: "mp3",
      Engine: "neural",
    })

    const response = await pollyClient.send(command)
    
    // Convert the audio stream to base64
    const audioData = await response.AudioStream?.transformToByteArray()
    if (!audioData) throw new Error("No audio data received")
    
    const base64Audio = Buffer.from(audioData).toString('base64')
    return `data:audio/mp3;base64,${base64Audio}`
  } catch (error) {
    console.error("Speech synthesis error:", error)
    throw new Error("Failed to synthesize speech")
  }
}
