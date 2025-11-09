"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import IntimacyCircles from "@/components/intimacy-circles"
import TextInputModal from "@/components/text-input-modal"

export default function Home() {
  const [circleTexts, setCircleTexts] = useState<string[]>(["", "", "", "", ""])
  const [selectedCircle, setSelectedCircle] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)

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

    // Dynamic import for html2canvas
    const html2canvas = (await import("html2canvas")).default

    const canvas = await html2canvas(element, {
      backgroundColor: "#ffffff",
      scale: 2,
      allowTaint: true,
      useCORS: true,
    })

    const link = document.createElement("a")
    link.href = canvas.toDataURL("image/png")
    link.download = "circulo-intimidad.png"
    link.click()
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Header */}
      <div className="w-full max-w-2xl mb-8 sm:mb-12 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-slate-900 tracking-tight mb-2">Círculo de</h1>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-slate-900 tracking-tight mb-8">intimidad</h1>
      </div>

      {/* Circles Canvas */}
      <div ref={canvasRef} className="w-full max-w-sm mb-8 sm:mb-12 flex justify-center bg-white p-4 rounded-lg">
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
