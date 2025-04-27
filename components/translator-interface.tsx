"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { translateText, TranslationService } from "@/app/actions"
import { Loader2, Volume2, Copy, RotateCcw, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { LANGUAGES } from "@/lib/languages"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function TranslatorInterface() {
  const [sourceLanguage, setSourceLanguage] = useState("en")
  const [targetLanguage, setTargetLanguage] = useState("es")
  const [inputText, setInputText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [isTranslating, setIsTranslating] = useState(false)
  const [isPlayingSource, setIsPlayingSource] = useState(false)
  const [isPlayingTarget, setIsPlayingTarget] = useState(false)
  const [sourceAudioUrl, setSourceAudioUrl] = useState("")
  const [targetAudioUrl, setTargetAudioUrl] = useState("")
  const [translationService, setTranslationService] = useState<TranslationService>("gemini")
  const [errorMessage, setErrorMessage] = useState("")
  const { toast } = useToast()

  // Initialize speech synthesis
  useEffect(() => {
    // Check if the browser supports speech synthesis
    if (!('speechSynthesis' in window)) {
      console.warn("Browser doesn't support speech synthesis");
    }
  }, []);

  const handleTranslate = async () => {
    if (!inputText.trim()) return

    setIsTranslating(true)
    setErrorMessage("")

    try {
      // First attempt the translation
      const result = await translateText(inputText, sourceLanguage, targetLanguage, translationService)
      setTranslatedText(result)

      // Store the text for speech synthesis
      setSourceAudioUrl(`browser-tts://${encodeURIComponent(inputText)}?lang=${sourceLanguage}`);
      setTargetAudioUrl(`browser-tts://${encodeURIComponent(result)}?lang=${targetLanguage}`);
      
      toast({
        title: "Translation Complete",
        description: `Translated using ${getServiceDisplayName(translationService)}`,
      })
    } catch (error) {
      console.error("Translation process error:", error)
      let errorMsg = "Failed to translate text. Please try again."
      
      if (error instanceof Error) {
        errorMsg = error.message || errorMsg
      }
      
      setErrorMessage(errorMsg)
      
      toast({
        title: "Translation Error",
        description: errorMsg,
        variant: "destructive",
      })
    } finally {
      setIsTranslating(false)
    }
  }

  const getServiceDisplayName = (service: TranslationService): string => {
    switch (service) {
      case "google": return "Google Translate";
      case "gemini": return "Google Gemini (AI-Enhanced)";
      default: return service;
    }
  }

  const handlePlayAudio = async (isSource: boolean) => {
    const audioUrl = isSource ? sourceAudioUrl : targetAudioUrl
    const setPlaying = isSource ? setIsPlayingSource : setIsPlayingTarget
    const language = isSource ? sourceLanguage : targetLanguage
    const text = isSource ? inputText : translatedText

    if (!audioUrl) return

    // Check if this is a browser TTS URL
    if (audioUrl.startsWith('browser-tts://')) {
      setPlaying(true)
      
      try {
        // Use the browser's speech synthesis
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        
        utterance.onend = () => {
          setPlaying(false);
        };
        
        utterance.onerror = (event) => {
          console.error("Speech synthesis error:", event);
          setPlaying(false);
          toast({
            title: "Speech Error",
            description: "Could not play audio. Your browser may not support this language.",
            variant: "destructive",
          });
        };
        
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error("Browser TTS error:", err);
        setPlaying(false);
        toast({
          title: "Speech Error",
          description: "Your browser doesn't support text-to-speech.",
          variant: "destructive",
        });
      }
      return;
    }

    // Fall back to audio playback for non-browser TTS URLs
    const audio = new Audio(audioUrl)
    setPlaying(true)

    audio.onended = () => {
      setPlaying(false)
    }

    audio.play().catch((err) => {
      console.error("Audio playback error:", err)
      setPlaying(false)
      toast({
        title: "Playback Error",
        description: "Failed to play audio. Please try again.",
        variant: "destructive",
      })
    })
  }

  const handleCopyText = () => {
    if (!translatedText) return

    navigator.clipboard.writeText(translatedText)
    toast({
      title: "Copied!",
      description: "Translated text copied to clipboard",
    })
  }

  const handleReset = () => {
    setInputText("")
    setTranslatedText("")
    setSourceAudioUrl("")
    setTargetAudioUrl("")
    setErrorMessage("")
  }

  const handleSwapLanguages = () => {
    const temp = sourceLanguage
    setSourceLanguage(targetLanguage)
    setTargetLanguage(temp)
    setInputText(translatedText)
    setTranslatedText("")
    setSourceAudioUrl("")
    setTargetAudioUrl("")
    setErrorMessage("")
  }

  return (
    <Card className="w-full max-w-2xl shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold">AI-Powered Multilingual Translator</CardTitle>
            <CardDescription>
              {translationService === "gemini" 
                ? "Powered by Google Gemini for enhanced natural translations" 
                : "Using Google Translate API for direct translations"}
            </CardDescription>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Translation Settings</h4>
                <div className="space-y-2">
                  <Label htmlFor="translation-service">Translation Provider</Label>
                  <Select
                    value={translationService}
                    onValueChange={(value) => setTranslationService(value as TranslationService)}
                  >
                    <SelectTrigger id="translation-service">
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gemini">Google Gemini (AI-Enhanced)</SelectItem>
                      <SelectItem value="google">Google Translate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Using browser-based Text-to-Speech for audio
                  </p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Source Language" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(LANGUAGES).map(([code, name]) => (
                <SelectItem key={`source-${code}`} value={code}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={handleSwapLanguages}
            disabled={!translatedText || isTranslating}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
            >
              <path
                d="M3.35355 5.64645C3.15829 5.45118 2.84171 5.45118 2.64645 5.64645C2.45118 5.84171 2.45118 6.15829 2.64645 6.35355L6.14645 9.85355C6.34171 10.0488 6.65829 10.0488 6.85355 9.85355L10.3536 6.35355C10.5488 6.15829 10.5488 5.84171 10.3536 5.64645C10.1583 5.45118 9.84171 5.45118 9.64645 5.64645L7 8.29289V2.5C7 2.22386 6.77614 2 6.5 2C6.22386 2 6 2.22386 6 2.5V8.29289L3.35355 5.64645ZM12.5 10C12.7761 10 13 10.2239 13 10.5V12.5C13 12.7761 12.7761 13 12.5 13H2.5C2.22386 13 2 12.7761 2 12.5V10.5C2 10.2239 2.22386 10 2.5 10C2.77614 10 3 10.2239 3 10.5V12H12V10.5C12 10.2239 12.2239 10 12.5 10Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </Button>

          <Select value={targetLanguage} onValueChange={setTargetLanguage}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Target Language" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(LANGUAGES).map(([code, name]) => (
                <SelectItem key={`target-${code}`} value={code}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Input Text</h3>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePlayAudio(true)}
              disabled={!inputText || isPlayingSource}
            >
              {isPlayingSource ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Textarea
            placeholder="Enter text to translate..."
            className="min-h-[120px] resize-none"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isTranslating}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Translation</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyText} disabled={!translatedText || isTranslating}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePlayAudio(false)}
                disabled={!translatedText || isPlayingTarget || isTranslating}
              >
                {isPlayingTarget ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="min-h-[120px] p-3 bg-muted rounded-md">
            {isTranslating ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : errorMessage ? (
              <div className="h-full flex items-center justify-center text-destructive">
                <p className="text-center">{errorMessage}</p>
              </div>
            ) : (
              <p className="whitespace-pre-wrap">{translatedText}</p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleReset} disabled={isTranslating}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button onClick={handleTranslate} disabled={!inputText.trim() || isTranslating}>
          {isTranslating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Translating...
            </>
          ) : (
            "Translate"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
