"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, LogIn } from "lucide-react"
import SplineViewer from "@/components/spline-viewer"

export default function HomePage() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Spline 3D object */}
      <div className="absolute inset-0">
        <SplineViewer url="https://prod.spline.design/pY4CEJVxSZ9x753F/scene.splinecode" />
      </div>

      {/* Login button */}
      <div className="absolute top-8 right-8 z-10">
        <Link href="/login">
          <Button variant="outline" className="rounded-full shadow-lg bg-background/80 backdrop-blur-sm">
            <LogIn className="mr-2 h-4 w-4" />
            Login
          </Button>
        </Link>
      </div>
      
      {/* Hero Text */}
      <div className="absolute top-1/4 left-0 w-full flex justify-center items-center z-10">
        <div className="text-center space-y-4 max-w-xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground drop-shadow-md">
            Google Gemini Translator
          </h1>
          <p className="text-xl text-primary-foreground/90 drop-shadow-md">
            Powered exclusively by Google Gemini AI for smarter, more natural translations across 30+ languages
          </p>
        </div>
      </div>
     
      {/* Get Started button */}
      <div className="absolute bottom-16 left-0 w-full flex justify-center items-center z-10">
        <Link href="/translator">
          <Button
            size="lg"
            className="px-8 py-6 text-lg font-semibold rounded-full shadow-lg bg-primary hover:bg-primary/90 transition-all"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
