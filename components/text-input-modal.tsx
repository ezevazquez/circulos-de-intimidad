"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface TextInputModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (text: string) => void
  initialText: string
  circleIndex: number
}

const CIRCLE_LABELS = ["Nivel 1", "Nivel 2", "Nivel 3", "Nivel 4", "Nivel 5"]

export default function TextInputModal({ isOpen, onClose, onSave, initialText, circleIndex }: TextInputModalProps) {
  const [text, setText] = useState(initialText)

  useEffect(() => {
    setText(initialText)
  }, [initialText])

  const handleSave = () => {
    onSave(text)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-light text-slate-900">{CIRCLE_LABELS[circleIndex]}</h2>
            <p className="text-sm text-slate-500 mt-1">Añade o edita el texto para este círculo</p>
          </div>

          {/* Text Input */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escribe aquí..."
            className="w-full h-32 p-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none text-slate-900 placeholder-slate-400 transition-all"
            autoFocus
          />

          {/* Character Count */}
          <p className="text-xs text-slate-400 mt-2 text-right">{text.length} caracteres</p>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-lg border-slate-200 text-slate-900 hover:bg-slate-50 bg-transparent"
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg">
              Guardar
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
