"use client"

import { useEffect, useRef, useState } from "react"
import { LoadingSpinner } from "./loading-spinner"

interface SplineViewerProps {
  url: string
  className?: string
}

export default function SplineViewer({ url, className = "" }: SplineViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Ensure the Spline viewer script is loaded
    if (!document.querySelector('script[src*="splinetool/viewer"]')) {
      const script = document.createElement("script")
      script.type = "module"
      script.src = "https://unpkg.com/@splinetool/viewer@1.9.87/build/spline-viewer.js"
      document.head.appendChild(script)
    }

    // Create and append the Spline viewer element
    if (containerRef.current) {
      // Check if a viewer already exists
      let splineViewer = containerRef.current.querySelector("spline-viewer")

      if (!splineViewer) {
        splineViewer = document.createElement("spline-viewer") as any
        splineViewer.setAttribute("url", url)
        splineViewer.setAttribute("loading-anim", "true")
        splineViewer.style.width = "100%"
        splineViewer.style.height = "100%"

        // Add event listeners for loading state
        splineViewer.addEventListener("load", () => {
          setIsLoading(false)
        })

        containerRef.current.appendChild(splineViewer)
      }
    }

    // Set a timeout to hide the loading spinner after a reasonable time
    // in case the load event doesn't fire
    const timeout = setTimeout(() => {
      setIsLoading(false)
    }, 8000)

    return () => {
      clearTimeout(timeout)
    }
  }, [url])

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div ref={containerRef} className="w-full h-full" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <LoadingSpinner />
        </div>
      )}
    </div>
  )
}
