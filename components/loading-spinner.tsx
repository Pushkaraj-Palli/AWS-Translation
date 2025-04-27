export function LoadingSpinner({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-t-2 border-b-2 border-primary animate-spin"></div>
        <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-r-2 border-l-2 border-transparent border-opacity-50 animate-pulse"></div>
      </div>
      <span className="ml-3 text-lg font-medium">Loading...</span>
    </div>
  )
}
