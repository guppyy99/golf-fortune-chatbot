"use client"

interface IntroPageProps {
  onStart: () => void
}

export function IntroPage({ onStart }: IntroPageProps) {
  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="w-full aspect-[4/5] bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-300 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <p className="text-sm">대문 이미지 영역</p>
          <p className="text-xs text-gray-400">(4:5 비율)</p>
        </div>
      </div>

      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
          나의 오늘의
          <br />
          골프 운세는?
        </h1>

        <p className="text-sm text-gray-600 mb-8 leading-relaxed">
          던롭스포츠코리아와 함께하는
          <br />
          오늘의 라운딩 운세
        </p>

        <button
          onClick={onStart}
          className="w-full bg-black text-white py-4 rounded-full font-medium text-lg hover:bg-gray-800 transition-colors"
        >
          시작하기!
        </button>
      </div>
    </div>
  )
}
