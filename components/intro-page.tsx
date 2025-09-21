"use client"

import Image from "next/image"

interface IntroPageProps {
  onStart: () => void
}

export function IntroPage({ onStart }: IntroPageProps) {
  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="w-full aspect-[4/5] relative overflow-hidden">
        <Image 
          src="/main-image.jpg" 
          alt="골프 운세 캠페인 메인 이미지"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>

      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
          올해 골프 운세를 알려주마
          <br />
          너의 운세는 버디일까 OB일까
        </h1>

        <p className="text-sm text-gray-600 mb-8 leading-relaxed">
          골프의 신 '골신'이 알려주는
          <br />
          올해의 골프 운세
        </p>

        <button
          onClick={onStart}
          className="w-full bg-black text-white py-4 rounded-full font-medium text-lg hover:bg-gray-800 transition-colors"
        >
          운세시작!
        </button>
      </div>
    </div>
  )
}
