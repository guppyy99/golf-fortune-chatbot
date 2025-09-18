"use client"

import { CheckCircle, Circle, Loader2 } from "lucide-react"

interface PhaseIndicatorProps {
  currentPhase: "form" | "analyzing" | "generating" | "result"
}

export function PhaseIndicator({ currentPhase }: PhaseIndicatorProps) {
  const phases = [
    { id: "form", title: "정보수집", description: "사용자 정보 수집" },
    { id: "analyzing", title: "정보분석", description: "사용자 정보 분석 및 운세 도출" },
    { id: "generating", title: "운세도출", description: "사용자 정보를 바탕으로 운세 작성 및 도출" }
  ]

  const getPhaseStatus = (phaseId: string) => {
    if (phaseId === "form") {
      return currentPhase === "form" ? "current" : "completed"
    }
    if (phaseId === "analyzing") {
      if (currentPhase === "analyzing") return "current"
      if (currentPhase === "generating" || currentPhase === "result") return "completed"
      return "pending"
    }
    if (phaseId === "generating") {
      if (currentPhase === "generating") return "current"
      if (currentPhase === "result") return "completed"
      return "pending"
    }
    return "pending"
  }

  const getIcon = (phaseId: string) => {
    const status = getPhaseStatus(phaseId)
    
    if (status === "completed") {
      return <CheckCircle className="w-5 h-5 text-green-500" />
    }
    if (status === "current") {
      return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
    }
    return <Circle className="w-5 h-5 text-gray-300" />
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 border">
        <div className="flex items-center space-x-6">
          {phases.map((phase, index) => (
            <div key={phase.id} className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                {getIcon(phase.id)}
                <div className="text-sm">
                  <div className={`font-medium ${
                    getPhaseStatus(phase.id) === "current" ? "text-blue-600" :
                    getPhaseStatus(phase.id) === "completed" ? "text-green-600" :
                    "text-gray-500"
                  }`}>
                    {phase.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    {phase.description}
                  </div>
                </div>
              </div>
              {index < phases.length - 1 && (
                <div className={`w-8 h-0.5 ${
                  getPhaseStatus(phases[index + 1].id) === "pending" ? "bg-gray-300" : "bg-green-500"
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
