"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { UserInfo, FortuneAnalysis } from "./golf-fortune-app"

// 운세 텍스트를 섹션별로 파싱하는 함수
function parseFortuneSections(fortuneText: string) {
  if (!fortuneText) return null

  const sections = []
  const lines = fortuneText.split('\n')
  
  let currentSection = null
  let currentContent = []
  
  for (const line of lines) {
    const trimmedLine = line.trim()
    
    // 섹션 헤더 감지
    if (trimmedLine.includes('전반 기류') || trimmedLine.includes('세부 운세') || 
        trimmedLine.includes('멘탈 운') || trimmedLine.includes('기술 운') || 
        trimmedLine.includes('체력 운') || trimmedLine.includes('인맥 운') || 
        trimmedLine.includes('종합') || trimmedLine.includes('허허')) {
      
      // 이전 섹션 저장
      if (currentSection && currentContent.length > 0) {
        sections.push({
          type: currentSection,
          content: currentContent.join('\n').trim()
        })
      }
      
      // 새 섹션 시작
      if (trimmedLine.includes('전반 기류')) {
        currentSection = 'overall'
        currentContent = [trimmedLine]
      } else if (trimmedLine.includes('세부 운세')) {
        currentSection = 'details'
        currentContent = [trimmedLine]
      } else if (trimmedLine.includes('멘탈 운')) {
        currentSection = 'mental'
        currentContent = [trimmedLine]
      } else if (trimmedLine.includes('기술 운')) {
        currentSection = 'skill'
        currentContent = [trimmedLine]
      } else if (trimmedLine.includes('체력 운')) {
        currentSection = 'physical'
        currentContent = [trimmedLine]
      } else if (trimmedLine.includes('인맥 운')) {
        currentSection = 'network'
        currentContent = [trimmedLine]
      } else if (trimmedLine.includes('종합')) {
        currentSection = 'summary'
        currentContent = [trimmedLine]
      } else if (trimmedLine.includes('허허')) {
        currentSection = 'final'
        currentContent = [trimmedLine]
      }
    } else if (trimmedLine && currentSection) {
      currentContent.push(trimmedLine)
    }
  }
  
  // 마지막 섹션 저장
  if (currentSection && currentContent.length > 0) {
    sections.push({
      type: currentSection,
      content: currentContent.join('\n').trim()
    })
  }
  
  return sections.map((section, index) => {
    const sectionConfig = getSectionConfig(section.type)
    return (
      <div key={index} className={`p-6 rounded-xl border ${sectionConfig.bg} ${sectionConfig.border}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${sectionConfig.iconBg}`}>
            <span className="text-white text-sm">{sectionConfig.icon}</span>
          </div>
          <h3 className={`text-lg font-bold ${sectionConfig.titleColor}`}>
            {sectionConfig.title}
          </h3>
        </div>
        <div className={`text-sm leading-relaxed ${sectionConfig.textColor}`}>
          {section.content}
        </div>
      </div>
    )
  })
}

// 섹션별 설정
function getSectionConfig(type: string) {
  const configs = {
    overall: {
      title: '전반 기류',
      icon: '🌊',
      iconBg: 'bg-gradient-to-br from-blue-400 to-cyan-400',
      bg: 'bg-gradient-to-r from-blue-50 to-cyan-50',
      border: 'border-blue-100',
      titleColor: 'text-blue-800',
      textColor: 'text-blue-700'
    },
    details: {
      title: '세부 운세',
      icon: '🔍',
      iconBg: 'bg-gradient-to-br from-purple-400 to-pink-400',
      bg: 'bg-gradient-to-r from-purple-50 to-pink-50',
      border: 'border-purple-100',
      titleColor: 'text-purple-800',
      textColor: 'text-purple-700'
    },
    mental: {
      title: '멘탈 운',
      icon: '🧠',
      iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-400',
      bg: 'bg-gradient-to-r from-emerald-50 to-teal-50',
      border: 'border-emerald-100',
      titleColor: 'text-emerald-800',
      textColor: 'text-emerald-700'
    },
    skill: {
      title: '기술 운',
      icon: '⚡',
      iconBg: 'bg-gradient-to-br from-amber-400 to-orange-400',
      bg: 'bg-gradient-to-r from-amber-50 to-orange-50',
      border: 'border-amber-100',
      titleColor: 'text-amber-800',
      textColor: 'text-amber-700'
    },
    physical: {
      title: '체력 운',
      icon: '💪',
      iconBg: 'bg-gradient-to-br from-red-400 to-pink-400',
      bg: 'bg-gradient-to-r from-red-50 to-pink-50',
      border: 'border-red-100',
      titleColor: 'text-red-800',
      textColor: 'text-red-700'
    },
    network: {
      title: '인맥 운',
      icon: '🤝',
      iconBg: 'bg-gradient-to-br from-indigo-400 to-purple-400',
      bg: 'bg-gradient-to-r from-indigo-50 to-purple-50',
      border: 'border-indigo-100',
      titleColor: 'text-indigo-800',
      textColor: 'text-indigo-700'
    },
    summary: {
      title: '종합 메시지',
      icon: '🎯',
      iconBg: 'bg-gradient-to-br from-yellow-400 to-orange-400',
      bg: 'bg-gradient-to-r from-yellow-50 to-orange-50',
      border: 'border-yellow-100',
      titleColor: 'text-yellow-800',
      textColor: 'text-yellow-700'
    },
    final: {
      title: '마무리 조언',
      icon: '✨',
      iconBg: 'bg-gradient-to-br from-gray-400 to-gray-600',
      bg: 'bg-gradient-to-r from-gray-50 to-gray-100',
      border: 'border-gray-200',
      titleColor: 'text-gray-800',
      textColor: 'text-gray-700'
    }
  }
  
  return configs[type] || configs.final
}

interface FortuneResultProps {
  userInfo: UserInfo
  fortuneData: FortuneAnalysis
  onRestart: () => void
}

export function FortuneResult({ userInfo, fortuneData, onRestart }: FortuneResultProps) {
  return (
    <div className="w-full max-w-2xl mx-auto fade-in space-y-6">
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center">
            <span className="text-3xl">🏌️</span>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            {userInfo.name}님의 골프 운세
          </CardTitle>
          <div className="text-xl text-gray-700 font-semibold mb-4">{fortuneData.fortune?.title}</div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-400 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">🏌️</span>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500">행운의 클럽</div>
                <div className="font-semibold text-gray-800">{fortuneData.fortune?.luckyClub}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-400 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">🚩</span>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500">행운의 홀</div>
                <div className="font-semibold text-gray-800">{fortuneData.fortune?.luckyHole}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">🎒</span>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500">행운의 아이템</div>
                <div className="font-semibold text-gray-800">{fortuneData.fortune?.luckyItem}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>


            {/* 골신 할아버지 운세 - 동적 파싱 */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-3xl">🧙‍♂️</span>
                  </div>
                  <h2 className="text-2xl font-bold text-amber-800 mb-2">골신 할아버지의 운세</h2>
                  <p className="text-gray-600">100년 넘게 골프를 지켜본 신선의 지혜</p>
                </div>
                
                <div className="space-y-6">
                  {parseFortuneSections(fortuneData.fortune?.title || '')}
                </div>
              </CardContent>
            </Card>


      <div className="flex gap-4">
        <Button
          onClick={onRestart}
          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0"
        >
          다시 운세보기
        </Button>
        <Button
          variant="outline"
          className="flex-1 bg-white/80 hover:bg-white border border-gray-200 text-gray-700"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `${userInfo.name}님의 골프 운세`,
                text: fortuneData.fortune?.title,
                url: window.location.href,
              })
            }
          }}
        >
          공유하기
        </Button>
      </div>
    </div>
  )
}
