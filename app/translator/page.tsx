"use client";

import TranslatorInterface from "@/components/translator-interface"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, LogOut } from "lucide-react"
import ProtectedRoute from "@/app/components/ProtectedRoute"
import { useAuth } from "@/app/context/AuthContext";

export default function TranslatorPage() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // No need to redirect as ProtectedRoute will handle it
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen flex flex-col">
        <header className="w-full p-4 bg-background/80 backdrop-blur-sm border-b z-10">
          <div className="container flex justify-between items-center">
            <h1 className="text-2xl font-bold">Multilingual Translator</h1>
            <div className="flex gap-2">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center p-6">
          <TranslatorInterface />
        </div>
      </main>
    </ProtectedRoute>
  )
}
