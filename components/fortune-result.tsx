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

            {/* 사주 분석 결과 */}
            {fortuneData.analysis && (
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    사주 분석 결과
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-100">
                      <h3 className="font-semibold text-purple-600 mb-2">당신의 사주</h3>
                      <p className="text-gray-700 text-sm whitespace-pre-wrap">{fortuneData.analysis.sajuSummary || '사주 정보를 불러오는 중...'}</p>
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-100">
                      <h3 className="font-semibold text-orange-600 mb-2">오행</h3>
                      <p className="text-gray-700 text-sm font-medium">{fortuneData.analysis.element_name || fortuneData.analysis.element || '목(木)'}</p>
                      <p className="text-gray-600 text-xs mt-1 whitespace-pre-wrap">{fortuneData.analysis.element_description || '오행 정보를 불러오는 중...'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                      <h3 className="font-semibold text-green-600 mb-2">골프 성격</h3>
                      <p className="text-gray-700 text-sm whitespace-pre-wrap">{fortuneData.analysis.personality || '성격 분석 중...'}</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100">
                      <h3 className="font-semibold text-blue-600 mb-2">플레이 스타일</h3>
                      <p className="text-gray-700 text-sm whitespace-pre-wrap">{fortuneData.analysis.golfStyle || '스타일 분석 중...'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-xl border border-yellow-100">
                      <h3 className="font-semibold text-yellow-600 mb-2">강점</h3>
                      <p className="text-gray-700 text-sm whitespace-pre-wrap">{Array.isArray(fortuneData.analysis.strengths) ? fortuneData.analysis.strengths.join(', ') : (fortuneData.analysis.strengths || '강점 분석 중...')}</p>
                    </div>
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-xl border border-red-100">
                      <h3 className="font-semibold text-red-600 mb-2">약점</h3>
                      <p className="text-gray-700 text-sm whitespace-pre-wrap">{Array.isArray(fortuneData.analysis.weaknesses) ? fortuneData.analysis.weaknesses.join(', ') : (fortuneData.analysis.weaknesses || '약점 분석 중...')}</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
                    <h3 className="font-semibold text-indigo-600 mb-2">행운 요소</h3>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(fortuneData.analysis.lucky_elements) ? (
                        fortuneData.analysis.lucky_elements.map((element, index) => (
                          <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                            {element}
                          </span>
                        ))
                      ) : (
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                          {fortuneData.analysis.lucky_elements}
                        </span>
                      )}
                      {fortuneData.analysis.lucky_numbers && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                          행운의 숫자: {Array.isArray(fortuneData.analysis.lucky_numbers) ? fortuneData.analysis.lucky_numbers.join(', ') : fortuneData.analysis.lucky_numbers}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  상세 운세
                </CardTitle>
              </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-emerald-600 mb-2">1) 내기 운</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{fortuneData.fortune?.bettingFortune || '내기 운을 분석하는 중...'}</p>
          </div>

          <div>
            <h3 className="font-semibold text-emerald-600 mb-2">2) 골프장 운</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{fortuneData.fortune?.courseFortune || '골프장 운을 분석하는 중...'}</p>
          </div>

          <div>
            <h3 className="font-semibold text-emerald-600 mb-2">3) 스코어 운</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{fortuneData.fortune?.scoreFortune || '스코어 운을 분석하는 중...'}</p>
          </div>

          <div>
            <h3 className="font-semibold text-emerald-600 mb-2">4) 공략 운</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{fortuneData.fortune?.strategyFortune || '공략 운을 분석하는 중...'}</p>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-100 text-center">
            <h3 className="font-semibold text-emerald-600 mb-2">5) 마무리 한줄</h3>
            <p className="text-gray-700 italic text-lg whitespace-pre-wrap">"{fortuneData.fortune?.quote || '마무리 메시지를 준비하는 중...'}"</p>
          </div>
        </CardContent>
      </Card>

      {/* 데이터 저장 정보 표시 */}
      {fortuneData.exportInfo && (
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              📁 데이터 저장 완료
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">JSON 파일:</span>
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  {fortuneData.exportInfo.jsonPath?.split('/').pop()}
                </code>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">CSV 파일:</span>
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  {fortuneData.exportInfo.csvPath?.split('/').pop()}
                </code>
              </div>
              <div className="text-xs text-gray-400 mt-2">
                저장 위치: /data/users/ 디렉토리
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
