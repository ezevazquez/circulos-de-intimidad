"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import IntimacyCircles from "@/components/intimacy-circles"
import TextInputModal from "@/components/text-input-modal"
import { Input } from "@/components/ui/input"

const PASSWORD = "787"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [circleTexts, setCircleTexts] = useState<string[]>(["", "", "", "", ""])
  const [selectedCircle, setSelectedCircle] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === PASSWORD) {
      setIsAuthenticated(true)
    } else {
      alert("Contraseña incorrecta")
      setPassword("")
    }
  }

  const handleCircleClick = (index: number) => {
    setSelectedCircle(index)
    setIsModalOpen(true)
  }

  const handleSaveText = (text: string) => {
    if (selectedCircle !== null) {
      const newTexts = [...circleTexts]
      newTexts[selectedCircle] = text
      setCircleTexts(newTexts)
    }
    setIsModalOpen(false)
  }

  const handleDownload = async () => {
    const element = canvasRef.current
    if (!element) return

    try {
      // Use dom-to-image which handles modern CSS colors better
      // @ts-ignore - dom-to-image doesn't have type definitions
      const domtoimage = (await import("dom-to-image")).default || (await import("dom-to-image"))
      
      const dataUrl = await (domtoimage as any).toPng(element, {
        bgcolor: "#FAFAFA",
        width: element.offsetWidth * 2,
        height: element.offsetHeight * 2,
        style: {
          transform: "scale(2)",
          transformOrigin: "top left",
        },
      })

      const link = document.createElement("a")
      link.href = dataUrl
      link.download = "circulo-intimidad.png"
      link.click()
    } catch (error) {
      console.error("Error generating image:", error)
      alert("Error al descargar la imagen. Por favor, intenta de nuevo.")
    }
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6" style={{ backgroundColor: "#FAFAFA" }}>
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-slate-900 tracking-tight mb-2">Círculo de</h1>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-slate-900 tracking-tight mb-8">intimidad</h1>
          </div>
          
          <form onSubmit={handlePasswordSubmit} className="bg-white p-8 rounded-lg shadow-sm">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
              Ingresa la contraseña
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="•••"
              maxLength={3}
              className="text-center text-2xl tracking-widest mb-4"
              autoFocus
            />
            <Button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg font-medium"
            >
              Ingresar
            </Button>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6" style={{ backgroundColor: "#FAFAFA" }}>
      {/* Header */}
      <div className="w-full max-w-2xl mb-8 sm:mb-12 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-slate-900 tracking-tight mb-2">Círculo de</h1>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-slate-900 tracking-tight mb-8">intimidad</h1>
      </div>

      {/* Circles Canvas */}
      <div ref={canvasRef} className="w-full max-w-sm mb-8 sm:mb-12 flex justify-center p-4 rounded-lg" style={{ backgroundColor: "#FAFAFA" }}>
        <IntimacyCircles texts={circleTexts} onCircleClick={handleCircleClick} />
      </div>

      {/* Download Button */}
      <Button
        onClick={handleDownload}
        className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-full font-medium text-base shadow-lg transition-all duration-200"
      >
        Descargar círculo
      </Button>

      {/* Text Input Modal */}
      {selectedCircle !== null && (
        <TextInputModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveText}
          initialText={circleTexts[selectedCircle]}
          circleIndex={selectedCircle}
        />
      )}
    </main>
  )
}
