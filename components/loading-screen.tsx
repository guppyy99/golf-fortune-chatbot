"use client"

import { useEffect, useState } from "react"

interface LoadingScreenProps {
  userName?: string
  phase?: "analyzing" | "generating"
  analysis?: {
    personality: string
    golfStyle: string
    luckyElements: string[]
    weakPoints: string[]
    recommendations: string[]
  }
}

export function LoadingScreen({ userName = "고객", phase = "analyzing", analysis }: LoadingScreenProps) {
  const [dots, setDots] = useState("")
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  const analyzingSteps = [
    `${userName}님의 정보를 수집했습니다`,
    `생년월일과 시간을 분석하는 중...`,
    `성격과 골프 스타일을 파악하는 중...`,
    `행운의 요소를 찾는 중...`,
    `약점과 개선점을 분석하는 중...`,
  ]

  const generatingSteps = [
    `분석 결과를 바탕으로 운세를 생성합니다`,
    `OLLAMA AI가 운세를 작성하는 중...`,
    `행운의 클럽과 볼을 선정하는 중...`,
    `오늘의 플레이 전략을 수립하는 중...`,
    `최종 운세를 정리하는 중...`,
  ]

  const loadingSteps = phase === "analyzing" ? analyzingSteps : generatingSteps

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 500)

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1
        }
        return prev
      })
    }, 1200)

    // 실제 진행률에 맞춰 퍼센트 계산
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const stepProgress = ((currentStep + 1) / loadingSteps.length) * 100
        const targetProgress = Math.min(stepProgress, 100)
        
        if (prev < targetProgress) {
          return Math.min(prev + 2, targetProgress) // 더 빠르게 증가
        }
        return prev
      })
    }, 100)

    return () => {
      clearInterval(dotsInterval)
      clearInterval(stepInterval)
      clearInterval(progressInterval)
    }
  }, [loadingSteps.length, currentStep])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center relative bg-gradient-to-br from-green-50 to-blue-50">
      <div className="bg-white/90 backdrop-blur-sm p-12 rounded-3xl w-full max-w-sm mx-auto shadow-2xl border border-white/50 h-[500px] flex flex-col justify-center">
        <div className="relative mb-8 h-20 overflow-hidden bg-gradient-to-r from-green-100 to-green-200 rounded-xl p-4">
          {/* 홀컵 */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="w-6 h-6 bg-black rounded-full border-2 border-gray-800 shadow-inner relative hole-anticipation">
              <div className="absolute inset-0.5 bg-gray-900 rounded-full" />
              {/* 홀컵 깃발 */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div className="w-0.5 h-4 bg-yellow-400" />
                <div className="absolute top-0 left-0.5 w-2 h-1.5 bg-red-500 rounded-sm flag-wave" />
              </div>
            </div>
          </div>

          {/* 골프공 */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 bg-white rounded-full shadow-md golf-ball-rolling relative">
              {/* 골프공 딤플 패턴 */}
              <div className="absolute inset-0 rounded-full">
                <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-gray-200 rounded-full opacity-50" />
                <div className="absolute top-1 right-0.5 w-0.5 h-0.5 bg-gray-200 rounded-full opacity-50" />
                <div className="absolute bottom-0.5 left-1 w-0.5 h-0.5 bg-gray-200 rounded-full opacity-50" />
              </div>
            </div>
          </div>

          {/* 골프공 궤적 라인 */}
          <div className="absolute top-1/2 left-8 right-10 h-0.5 bg-gradient-to-r from-green-300/60 to-transparent transform -translate-y-1/2" />
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4 min-h-[3rem] flex items-center justify-center">
            {loadingSteps[currentStep]}
          </h2>

          <p className="text-gray-600 mb-6 min-h-[1.5rem] flex items-center justify-center">
            {phase === "analyzing" 
              ? `사용자 정보를 분석하고 있습니다${dots}` 
              : `OLLAMA AI가 운세를 생성하고 있습니다${dots}`
            }
          </p>

          {/* 분석 결과 미리보기 - 고정 높이 */}
          {phase === "generating" && analysis && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left min-h-[120px] flex flex-col justify-center">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">사주 분석 결과</h3>
              <div className="space-y-1 text-xs text-blue-700">
                <p><span className="font-medium">오행:</span> {analysis.element || '木'}</p>
                <p><span className="font-medium">성격:</span> {analysis.personality}</p>
                <p><span className="font-medium">골프 스타일:</span> {analysis.golfStyle}</p>
                <p><span className="font-medium">행운 요소:</span> {Array.isArray(analysis.luckyElements) ? analysis.luckyElements.join(', ') : analysis.luckyElements}</p>
                {analysis.sajuSummary && (
                  <p><span className="font-medium">사주:</span> {analysis.sajuSummary}</p>
                )}
              </div>
            </div>
          )}

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-sm text-gray-500 mt-2 text-center">{Math.round(progress)}%</p>
        </div>
      </div>

      {currentStep > 0 && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-lg animate-in slide-in-from-top-2 duration-500 shadow-lg border border-white/50">
            <p className="text-sm text-gray-700 font-medium">{loadingSteps[currentStep]}</p>
          </div>
        </div>
      )}
    </div>
  )
}
