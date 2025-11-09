"use client"

import { useState } from "react"

interface IntimacyCirclesProps {
  texts: string[]
  onCircleClick: (index: number) => void
}

const CIRCLE_CONFIG = [
  {
    id: 0,
    radius: 40,
    color: "rgba(255, 214, 214, 0.95)", // Rosa muy suave (casi blanco)
    label: "Nivel 1",
  },
  {
    id: 1,
    radius: 80,
    color: "rgba(255, 213, 166, 0.6)", // Rosa pastel
    label: "Nivel 2",
  },
  {
    id: 2,
    radius: 120,
    color: "rgba(194, 231, 255, 0.6)", // Azul cielo pastel
    label: "Nivel 3",
  },
  {
    id: 3,
    radius: 160,
    color: "rgba(191, 255, 213, 0.6)", // Verde menta pastel
    label: "Nivel 4",
  },
  {
    id: 4,
    radius: 200,
    color: "rgba(237, 233, 254, 0.6)", // Lavanda pastel
    label: "Nivel 5",
  },
]

export default function IntimacyCircles({ texts, onCircleClick }: IntimacyCirclesProps) {
  const [hoveredCircle, setHoveredCircle] = useState<number | null>(null)
  const containerSize = 420

  // Helper function to create arc path for text at the top of circle (inside the circle)
  const createArcPath = (radius: number, offset = 0) => {
    const centerX = radius
    const centerY = radius
    // Keep text just inside the circle border
    const padding = Math.max(radius * 0.08, 10)
    const innerRadius = radius - padding
    const adjustedRadius = Math.max(innerRadius - 2 - offset, 0)
    // Create a spread around the top (270°) so text hugs the circle curvature
    const spread = (160 * Math.PI) / 180 // ~160° arc along the top
    const centerAngle = (3 * Math.PI) / 2 // 270° (top)
    const startAngle = centerAngle - spread / 2
    const endAngle = centerAngle + spread / 2
    const x1 = centerX + adjustedRadius * Math.cos(startAngle)
    const y1 = centerY + adjustedRadius * Math.sin(startAngle)
    const x2 = centerX + adjustedRadius * Math.cos(endAngle)
    const y2 = centerY + adjustedRadius * Math.sin(endAngle)
    // Create arc path (large-arc flag = 0 for the smaller arc, sweep flag = 1 for clockwise)
    const largeArcFlag = spread > Math.PI ? 1 : 0
    return `M ${x1} ${y1} A ${adjustedRadius} ${adjustedRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`
  }

  return (
    <div className="flex justify-center items-center">
      <div
        className="relative flex items-center justify-center"
        style={{
          width: containerSize,
          height: containerSize,
        }}
      >
        {/* Circles from largest to smallest (render largest first so they appear behind) */}
        {CIRCLE_CONFIG.slice().reverse().map((config) => (
          <div
            key={config.id}
            className="absolute rounded-full transition-all duration-300"
            style={{
              width: config.radius * 2,
              height: config.radius * 2,
              transform: hoveredCircle === config.id ? "scale(1.05)" : "scale(1)",
            }}
          >
            <button
              onClick={() => onCircleClick(config.id)}
              onMouseEnter={() => setHoveredCircle(config.id)}
              onMouseLeave={() => setHoveredCircle(null)}
              className="absolute rounded-full cursor-pointer w-full h-full"
              style={{
                backgroundColor: config.color,
                border: "2px solid rgba(51, 65, 85, 0.8)",
                boxShadow: hoveredCircle === config.id ? "0 8px 24px rgba(15, 23, 42, 0.15)" : config.id === 4 ? "0 2px 8px rgba(0, 0, 0, 0.1)" : "none",
              }}
            />
            
            {/* Text content - Level 1 is straight, others are curved */}
            {config.id === 0 ? (
              // Level 1: Straight text at the top inside the circle
              <div
                className="absolute pointer-events-none flex items-center justify-center text-center"
                style={{
                  width: "100%",
                  height: "100%",
                  top: 0,
                  left: 0,
                  padding: "0 12px",
                }}
              >
                {texts[config.id] ? (
                  <p
                    className="font-bold break-words"
                    style={{
                      fontSize: "11px",
                      maxWidth: "80%",
                      lineHeight: "1.2",
                      color: "#0f172a",
                    }}
                  >
                    {texts[config.id]}
                  </p>
                ) : (
                  <p
                    className="font-medium text-center"
                    style={{
                      fontSize: "10px",
                      color: "rgba(100, 116, 139, 0.7)",
                    }}
                  >
                    Toca para añadir
                  </p>
                )}
              </div>
            ) : (
              // Levels 2-5: Curved text at the top inside the circle
              <svg
                className="absolute pointer-events-none"
                style={{
                  width: config.radius * 2,
                  height: config.radius * 2,
                  top: 0,
                  left: 0,
                }}
                viewBox={`0 0 ${config.radius * 2} ${config.radius * 2}`}
              >
                <defs>
                  <path
                    id={`circle-path-${config.id}`}
                    d={createArcPath(config.radius, config.id === 1 ? 4 : 0)}
                  />
                </defs>
                {texts[config.id] ? (
                  <text
                    fill="#0f172a"
                    style={{
                      fontSize: config.radius < 100 ? "11px" : config.radius < 140 ? "12px" : "13px",
                    }}
                    fontWeight="700"
                    dominantBaseline="middle"
                  >
                    <textPath
                      href={`#circle-path-${config.id}`}
                      startOffset="50%"
                      textAnchor="middle"
                    >
                      {texts[config.id]}
                    </textPath>
                  </text>
                ) : (
                  <text
                    fill="rgba(100, 116, 139, 0.7)"
                    style={{
                      fontSize: config.radius < 100 ? "10px" : "11px",
                    }}
                    dominantBaseline="middle"
                    fontWeight="500"
                  >
                    <textPath
                      href={`#circle-path-${config.id}`}
                      startOffset="50%"
                      textAnchor="middle"
                    >
                      Toca para añadir
                    </textPath>
                  </text>
                )}
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
