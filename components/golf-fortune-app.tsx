"use client"

import { useState } from "react"
import { UserInfoForm } from "./user-info-form"
import { FortuneResult } from "./fortune-result"
import { LoadingScreen } from "./loading-screen"
import { IntroPage } from "./intro-page"
import { PhaseIndicator } from "./phase-indicator"

export interface UserInfo {
  name: string
  phoneNumber?: string
  birthDate: string
  birthTime: string
  gender: string
  handicap: number
  countryClub?: string
  ironBrand?: string
  driverBrand?: string
  wedgeBrand?: string
  putterBrand?: string
  ballBrand?: string
}

export interface FortuneAnalysis {
  phase: 'analyzing' | 'generating' | 'complete'
  analysis?: {
    personality: string
    golfStyle: string
    luckyElements: string[]
    weakPoints: string[]
    recommendations: string[]
    sajuSummary?: string
    element?: string
    element_name?: string
    element_description?: string
    lucky_numbers?: number[]
  }
  fortune?: {
    title: string
    luckyClub: string
    luckyBall: string
    luckyHole: string
    luckyItem: string
    luckyTPO: string
    roundFortune: string
    bettingFortune: string
    courseFortune: string
    scoreFortune: string
    strategyFortune: string
    quote: string
  }
  exportInfo?: {
    jsonPath: string
    csvPath: string
    success: boolean
    error?: string
  }
}

export function GolfFortuneApp() {
  const [currentPhase, setCurrentPhase] = useState<"intro" | "form" | "analyzing" | "generating" | "result">("intro")
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [fortuneData, setFortuneData] = useState<FortuneAnalysis | null>(null)

  const handleFormComplete = async (data: UserInfo) => {
    setUserInfo(data)
    setCurrentPhase("analyzing")

    try {
      // 페이즈 2: 사용자 정보 분석
      const response = await fetch('/api/analyze-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('분석 실패')
      }

      const result = await response.json()
      
      // 페이즈 3: 운세 생성
      setCurrentPhase("generating")
      setFortuneData(result)
      
      // 완료
      setTimeout(() => {
        setCurrentPhase("result")
      }, 2000)

    } catch (error) {
      console.error('분석 오류:', error)
      // 오류 시 기본 운세로 폴백
      setFortuneData({
        phase: 'complete',
        analysis: {
          personality: '활발하고 도전적',
          golfStyle: '균형적',
          luckyElements: ['물'],
          weakPoints: ['퍼팅'],
          recommendations: ['충분한 워밍업을 하세요']
        },
        fortune: {
          title: "오늘은 신중하게 플레이하세요",
          luckyClub: "퍼터",
          luckyBall: "타이틀리스트",
          luckyHole: "9번홀",
          luckyItem: "거리측정기",
          luckyTPO: "청색 상의, 하얀색 하의",
          roundFortune: "오늘은 차분하게 플레이하는 것이 중요합니다.",
          bettingFortune: "작은 내기만 하세요.",
          courseFortune: "평지 코스가 좋겠습니다.",
          scoreFortune: "평소보다 2-3타 높게 잡으세요.",
          strategyFortune: "안전한 플레이를 선택하세요.",
          quote: "골프는 마음의 게임입니다."
        }
      })
      setCurrentPhase("result")
    }
  }

  const handleRestart = () => {
    setCurrentPhase("form")
    setUserInfo(null)
    setFortuneData(null)
  }

  const handleStart = () => {
    setCurrentPhase("form")
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {currentPhase === "intro" && <IntroPage onStart={handleStart} />}
      {currentPhase === "form" && <UserInfoForm onComplete={handleFormComplete} />}
      {(currentPhase === "analyzing" || currentPhase === "generating") && (
        <LoadingScreen 
          userName={userInfo?.name} 
          phase={currentPhase}
          analysis={fortuneData?.analysis}
        />
      )}
      {currentPhase === "result" && userInfo && fortuneData && (
        <FortuneResult 
          userInfo={userInfo} 
          fortuneData={fortuneData} 
          onRestart={handleRestart} 
        />
      )}
      
      {/* 페이즈 인디케이터 */}
      {currentPhase !== "intro" && (
        <PhaseIndicator currentPhase={currentPhase} />
      )}
    </div>
  )
}
