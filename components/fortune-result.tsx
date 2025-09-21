"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { UserInfo, FortuneAnalysis } from "./golf-fortune-app"

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
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-400 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">🏌️</span>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500">행운의 클럽</div>
                <div className="font-semibold text-gray-800">{fortuneData.fortune?.luckyClub}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">⚪</span>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500">행운의 볼</div>
                <div className="font-semibold text-gray-800">{fortuneData.fortune?.luckyBall}</div>
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

            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-blue-400 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">👕</span>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500">행운의 TPO</div>
                <div className="font-semibold text-gray-800">{fortuneData.fortune?.luckyTPO}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>


            {/* 골신 할아버지 운세 */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-3xl">🧙‍♂️</span>
                  </div>
                  <h2 className="text-2xl font-bold text-amber-800 mb-2">골신 할아버지의 운세</h2>
                  <p className="text-gray-600">100년 넘게 골프를 지켜본 신선의 지혜</p>
                </div>
                
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {fortuneData.fortune?.title || '골신 할아버지가 운세를 준비하고 있습니다...'}
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
