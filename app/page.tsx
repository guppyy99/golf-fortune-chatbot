"use client"
import { GolfFortuneApp } from "@/components/golf-fortune-app"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="absolute inset-0 bg-[url('/golf-course-landscape-blurred.jpg')] bg-cover bg-center opacity-20" />
      <GolfFortuneApp />
    </main>
  )
}
