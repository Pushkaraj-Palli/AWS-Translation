// Supported languages for translation
export const LANGUAGES: Record<string, string> = {
  ar: "Arabic",
  zh: "Chinese (Simplified)",
  "zh-TW": "Chinese (Traditional)",
  cs: "Czech",
  da: "Danish",
  nl: "Dutch",
  en: "English",
  fi: "Finnish",
  fr: "French",
  de: "German",
  el: "Greek",
  he: "Hebrew",
  hi: "Hindi",
  hu: "Hungarian",
  id: "Indonesian",
  it: "Italian",
  ja: "Japanese",
  ko: "Korean",
  ms: "Malay",
  no: "Norwegian",
  fa: "Persian",
  pl: "Polish",
  pt: "Portuguese",
  ro: "Romanian",
  ru: "Russian",
  es: "Spanish",
  sv: "Swedish",
  th: "Thai",
  tr: "Turkish",
  uk: "Ukrainian",
  vi: "Vietnamese",
}

// Map language codes to Polly voices
export function getLanguageVoice(languageCode: string): string {
  const voiceMap: Record<string, string> = {
    ar: "Zeina",
    zh: "Zhiyu",
    "zh-TW": "Zhiyu",
    cs: "Jakub",
    da: "Mads",
    nl: "Ruben",
    en: "Matthew",
    fi: "Suvi",
    fr: "Léa",
    de: "Vicki",
    el: "Aditi", // Fallback
    he: "Aditi", // Fallback
    hi: "Aditi",
    hu: "Tatyana", // Fallback
    id: "Salli", // Fallback
    it: "Carla",
    ja: "Takumi",
    ko: "Seoyeon",
    ms: "Salli", // Fallback
    no: "Liv",
    fa: "Aditi", // Fallback
    pl: "Ewa",
    pt: "Camila",
    ro: "Carmen",
    ru: "Tatyana",
    es: "Lupe",
    sv: "Astrid",
    th: "Salli", // Fallback
    tr: "Filiz",
    uk: "Tatyana", // Fallback
    vi: "Salli", // Fallback
  }

  return voiceMap[languageCode] || "Matthew" // Default to Matthew if no match
}
