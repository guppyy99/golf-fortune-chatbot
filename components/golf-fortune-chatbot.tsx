"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, RotateCcw } from "lucide-react"

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

const GOLF_FORTUNES = [
  "🏌️‍♂️ 오늘은 드라이버 샷이 특히 좋을 것 같습니다! 페어웨이 한복판을 노려보세요.",
  "⛳ 퍼팅에 집중하세요. 그린 위에서 당신의 진가가 발휘될 날입니다!",
  "🎯 오늘은 아이언 샷의 정확도가 빛날 것 같네요. 핀을 향해 과감하게!",
  "🌟 버디 찬스가 많이 올 것 같습니다. 공격적인 플레이를 해보세요!",
  "🏆 오늘은 당신의 베스트 스코어를 경신할 수 있는 날입니다!",
  "🌈 날씨가 좋아 컨디션이 최고일 것 같네요. 즐거운 라운딩 되세요!",
  "💪 오늘은 장타가 나올 것 같습니다. 힘차게 스윙해보세요!",
  "🎪 트러블 샷에서도 기적같은 샷이 나올 수 있는 날입니다!",
]

const GOLF_RESPONSES = [
  "홀인원의 기운이 느껴지네요! 🕳️‍♂️",
  "오늘 골프장에서 좋은 일이 있을 것 같아요! ⛳",
  "스윙이 완벽할 것 같은 날이네요! 🏌️‍♂️",
  "그린 위에서 당신이 주인공이 될 거예요! 🌟",
  "캐디백이 가벼워질 정도로 좋은 샷들이 나올 거예요! 🎯",
]

export function GolfFortuneChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "안녕하세요! 🏌️‍♂️ 골프 운세 챗봇입니다. 오늘의 골프 운세를 확인해보세요! 이름이나 궁금한 것을 말씀해주세요.",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateGolfResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("운세") || lowerMessage.includes("오늘")) {
      return GOLF_FORTUNES[Math.floor(Math.random() * GOLF_FORTUNES.length)]
    }

    if (lowerMessage.includes("스코어") || lowerMessage.includes("점수")) {
      return "오늘은 평소보다 5타 정도 좋은 스코어가 나올 것 같네요! 🎯 자신감을 가지고 플레이하세요!"
    }

    if (lowerMessage.includes("날씨") || lowerMessage.includes("바람")) {
      return "바람이 당신의 편이 될 것 같습니다! 🌬️ 순풍을 타고 장타를 노려보세요!"
    }

    if (lowerMessage.includes("퍼팅") || lowerMessage.includes("그린")) {
      return "오늘은 그린 리딩이 완벽할 것 같네요! 🎱 퍼터를 믿고 과감하게 굴려보세요!"
    }

    if (lowerMessage.includes("드라이버") || lowerMessage.includes("티샷")) {
      return "드라이버가 말을 잘 들을 것 같은 날입니다! 🚀 페어웨이 한복판을 노려보세요!"
    }

    // 기본 응답
    const randomResponse = GOLF_RESPONSES[Math.floor(Math.random() * GOLF_RESPONSES.length)]
    const randomFortune = GOLF_FORTUNES[Math.floor(Math.random() * GOLF_FORTUNES.length)]
    return `${randomResponse}\n\n${randomFortune}`
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // 타이핑 효과를 위한 지연
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateGolfResponse(inputValue),
        isUser: false,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleReset = () => {
    setMessages([
      {
        id: "1",
        content:
          "안녕하세요! 🏌️‍♂️ 골프 운세 챗봇입니다. 오늘의 골프 운세를 확인해보세요! 이름이나 궁금한 것을 말씀해주세요.",
        isUser: false,
        timestamp: new Date(),
      },
    ])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      {/* 헤더 */}
      <div className="bg-primary text-primary-foreground p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center">
              <span className="text-xl">⛳</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">골프 운세 챗봇</h1>
              <p className="text-sm opacity-90">당신의 골프 파트너</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 채팅 영역 */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? "justify-end" : "justify-start"} message-slide-in`}
            >
              <Card
                className={`max-w-[80%] p-3 ${
                  message.isUser ? "bg-primary text-primary-foreground ml-4" : "bg-card text-card-foreground mr-4"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-2 opacity-70 ${message.isUser ? "text-right" : "text-left"}`}>
                  {message.timestamp.toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </Card>
            </div>
          ))}

          {/* 타이핑 인디케이터 */}
          {isTyping && (
            <div className="flex justify-start message-slide-in">
              <Card className="bg-card text-card-foreground mr-4 p-3">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground">운세를 보고 있어요...</span>
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* 입력 영역 */}
      <div className="p-4 border-t bg-card">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="골프 운세를 물어보세요... 🏌️‍♂️"
            className="flex-1"
            disabled={isTyping}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* 빠른 질문 버튼들 */}
        <div className="flex flex-wrap gap-2 mt-3">
          {["오늘 운세", "스코어 예측", "퍼팅 운세", "드라이버 운세"].map((question) => (
            <Button
              key={question}
              variant="outline"
              size="sm"
              onClick={() => {
                setInputValue(question)
                setTimeout(() => handleSendMessage(), 100)
              }}
              disabled={isTyping}
              className="text-xs"
            >
              {question}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
