"use client"

export function GolfLoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-2">⛳ 골프 운세</h1>
        <p className="text-muted-foreground text-lg">당신의 골프 운을 확인해보세요!</p>
      </div>

      {/* 골프 홀컵 */}
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center hole-pulse">
          <div className="w-16 h-16 bg-background rounded-full border-4 border-primary/30 flex items-center justify-center">
            <div className="w-8 h-8 bg-primary/20 rounded-full"></div>
          </div>
        </div>

        {/* 골프공 애니메이션 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
          <div className="golf-ball-animation">
            <div className="w-6 h-6 bg-white rounded-full shadow-lg border-2 border-gray-200 relative">
              {/* 골프공 딤플 패턴 */}
              <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white to-gray-100">
                <div className="absolute top-1 left-1 w-1 h-1 bg-gray-300 rounded-full opacity-50"></div>
                <div className="absolute top-2 right-1 w-1 h-1 bg-gray-300 rounded-full opacity-50"></div>
                <div className="absolute bottom-1 left-1.5 w-1 h-1 bg-gray-300 rounded-full opacity-50"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>
        <p className="text-muted-foreground">운세를 준비하고 있습니다...</p>
      </div>
    </div>
  )
}
