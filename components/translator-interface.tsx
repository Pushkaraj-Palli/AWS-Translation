"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { translateText, synthesizeSpeech } from "@/app/actions"
import { Loader2, Volume2, Copy, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { LANGUAGES } from "@/lib/languages"

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
  const { toast } = useToast()

  const handleTranslate = async () => {
    if (!inputText.trim()) return

    try {
      setIsTranslating(true)
      const result = await translateText(inputText, sourceLanguage, targetLanguage)
      setTranslatedText(result)

      // Generate speech for both source and translated text
      const [sourceAudio, targetAudio] = await Promise.all([
        synthesizeSpeech(inputText, sourceLanguage),
        synthesizeSpeech(result, targetLanguage)
      ])
      
      setSourceAudioUrl(sourceAudio)
      setTargetAudioUrl(targetAudio)
    } catch (error) {
      toast({
        title: "Translation Error",
        description: "Failed to translate text. Please try again.",
        variant: "destructive",
      })
      console.error("Translation error:", error)
    } finally {
      setIsTranslating(false)
    }
  }

  const handlePlayAudio = async (isSource: boolean) => {
    const audioUrl = isSource ? sourceAudioUrl : targetAudioUrl
    const setPlaying = isSource ? setIsPlayingSource : setIsPlayingTarget

    if (!audioUrl) return

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
  }

  const handleSwapLanguages = () => {
    const temp = sourceLanguage
    setSourceLanguage(targetLanguage)
    setTargetLanguage(temp)
    setInputText(translatedText)
    setTranslatedText("")
    setSourceAudioUrl("")
    setTargetAudioUrl("")
  }

  return (
    <Card className="w-full max-w-2xl shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold">Multilingual Translator</CardTitle>
        <CardDescription>Translate text between multiple languages with AWS Translate</CardDescription>
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
              disabled={!sourceAudioUrl || isPlayingSource}
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
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Translation</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyText} disabled={!translatedText}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePlayAudio(false)}
                disabled={!targetAudioUrl || isPlayingTarget}
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
