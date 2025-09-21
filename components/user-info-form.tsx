"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { UserInfo } from "./golf-fortune-app"

interface UserInfoFormProps {
  onComplete: (data: UserInfo) => void
}

export function UserInfoForm({ onComplete }: UserInfoFormProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<Partial<UserInfo>>({
    handicap: 28,
  })
  const [showSummaryModal, setShowSummaryModal] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [noBirthTime, setNoBirthTime] = useState(false)

  const totalSteps = 6 // 기본 6단계: 이름, 휴대폰번호, 성별, 생년월일, 출생시간, 핸디캡

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      setShowSummaryModal(true)
    }
  }

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSummaryConfirm = () => {
    setShowSummaryModal(false)
    setShowTermsModal(true)
  }

  const handleTermsAgree = () => {
    setShowTermsModal(false)
    onComplete(formData as UserInfo)
  }

  const updateFormData = (field: keyof UserInfo, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const formatBirthDate = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 4) {
      return numbers
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 4)}.${numbers.slice(4)}`
    } else {
      return `${numbers.slice(0, 4)}.${numbers.slice(4, 6)}.${numbers.slice(6, 8)}`
    }
  }

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBirthDate(e.target.value)
    updateFormData("birthDate", formatted)
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.name && formData.name.trim() !== ""
      case 2:
        return formData.phoneNumber && formData.phoneNumber.trim() !== ""
      case 3:
        return formData.gender
      case 4:
        return formData.birthDate && formData.birthDate.length >= 10
      case 5:
        return formData.birthTime || noBirthTime
      case 6:
        return formData.handicap !== undefined
      default:
        return false
    }
  }

  const getStepContent = () => {
    switch (step) {
      case 1:
        return {
          title: "골신에게 운세를 볼\n당신의 이름은?",
          subtitle: "이름",
          placeholder: "이름을 입력해주세요",
        }
      case 2:
        return {
          title: `${formData.name || "김선우"}님의\n휴대폰 번호를 알려주세요.`,
          subtitle: "휴대폰 번호",
          placeholder: "010-1234-5678",
        }
      case 3:
        return {
          title: `${formData.name || "김선우"}님의\n성별을 알려주세요.`,
          subtitle: "성별",
        }
      case 4:
        return {
          title: `${formData.name || "김선우"}님의\n생년월일을 알려주세요.`,
          subtitle: "생년월일",
          placeholder: "1999.10.24",
        }
      case 5:
        return {
          title: `${formData.name || "김선우"}님의\n출생시간을 알려주세요.`,
          subtitle: "출생시간",
          placeholder: "00:00",
        }
      case 6:
        return {
          title: `${formData.name || "김선우"}님의\n평균 핸디캡을 알려주세요.`,
          subtitle: "핸디캡",
          helper: "기본값 28에서 조절하세요",
        }
      default:
        return { title: "", subtitle: "", placeholder: "" }
    }
  }

  const stepContent = getStepContent()

  return (
    <>
      <div className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-[600px]">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 h-16 flex-shrink-0">
          {step > 1 && (
            <button onClick={handlePrevious} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {step === 1 && <div className="w-10" />}
          <h1 className="text-lg font-semibold text-gray-800">골프 운세 정보</h1>
          <div className="w-10" />
        </div>

        <div className="p-4 h-12 flex-shrink-0">
          <p className="text-sm font-medium text-blue-600">
            STEP {step} / {totalSteps}
          </p>
        </div>

        <div className="flex-1 px-6 py-8 flex flex-col justify-center">
          <div className="w-full">
            <div className="h-32 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 leading-tight whitespace-pre-line">
                {stepContent.title}
              </h2>
            </div>

            <div className="h-40">
              {step === 1 && (
                <div className="transition-all duration-300 ease-in-out">
                  <Label className="text-sm text-gray-500 mb-2 block">{stepContent.subtitle}</Label>
                  <Input
                    value={formData.name || ""}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    placeholder={stepContent.placeholder}
                    className="border-0 border-b-2 border-gray-200 rounded-none bg-transparent px-0 py-3 text-base focus:border-blue-600 focus:ring-0 placeholder:text-gray-400 w-full"
                  />
                </div>
              )}

              {step === 2 && (
                <div className="transition-all duration-300 ease-in-out">
                  <Label className="text-sm text-gray-500 mb-2 block">{stepContent.subtitle}</Label>
                  <Input
                    value={formData.phoneNumber || ""}
                    onChange={(e) => updateFormData("phoneNumber", e.target.value)}
                    placeholder={stepContent.placeholder}
                    className="border-0 border-b-2 border-gray-200 rounded-none bg-transparent px-0 py-3 text-base focus:border-blue-600 focus:ring-0 placeholder:text-gray-400 w-full"
                  />
                </div>
              )}

              {step === 3 && (
                <div className="transition-all duration-300 ease-in-out">
                  <Label className="text-sm text-gray-500 mb-4 block">{stepContent.subtitle}</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={formData.gender === "남성" ? "default" : "outline"}
                      onClick={() => updateFormData("gender", "남성")}
                      className={`h-12 text-base font-medium ${
                        formData.gender === "남성"
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-300"
                      }`}
                    >
                      남성
                    </Button>
                    <Button
                      variant={formData.gender === "여성" ? "default" : "outline"}
                      onClick={() => updateFormData("gender", "여성")}
                      className={`h-12 text-base font-medium ${
                        formData.gender === "여성"
                          ? "bg-pink-500 text-white hover:bg-pink-600"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-300"
                      }`}
                    >
                      여성
                    </Button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="transition-all duration-300 ease-in-out">
                  <Label className="text-sm text-gray-500 mb-2 block">{stepContent.subtitle}</Label>
                  <Input
                    value={formData.birthDate || ""}
                    onChange={handleBirthDateChange}
                    placeholder={stepContent.placeholder}
                    maxLength={10}
                    className="border-0 border-b-2 border-gray-200 rounded-none bg-transparent px-0 py-3 text-base focus:border-blue-600 focus:ring-0 placeholder:text-gray-400 w-full"
                  />
                </div>
              )}

              {step === 5 && (
                <div className="transition-all duration-300 ease-in-out space-y-4">
                  <Label className="text-sm text-gray-500 mb-4 block">{stepContent.subtitle}</Label>
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <Button
                      variant={noBirthTime ? "default" : "outline"}
                      onClick={() => {
                        setNoBirthTime(true)
                        updateFormData("birthTime", "모름")
                      }}
                      className={`h-12 text-base font-medium ${
                        noBirthTime
                          ? "bg-gray-500 text-white hover:bg-gray-600"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-300"
                      }`}
                    >
                      모르겠어요
                    </Button>
                  </div>

                  {!noBirthTime && (
                    <div className="space-y-4">
                      <Label className="text-sm text-gray-500">출생시간을 입력해주세요</Label>
                      
                      {/* 수동 입력 옵션 */}
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs text-gray-400 mb-1 block">정확한 시간 (예: 14:30)</Label>
                          <Input
                            type="time"
                            value={formData.birthTime?.includes(':') ? formData.birthTime : ''}
                            onChange={(e) => updateFormData("birthTime", e.target.value)}
                            className="border-0 border-b-2 border-gray-200 rounded-none bg-transparent px-0 py-3 text-base focus:border-blue-600 focus:ring-0 placeholder:text-gray-400 w-full"
                          />
                        </div>
                        
                        <div className="text-center text-sm text-gray-500">또는</div>
                        
                        {/* 시간대 토글 */}
                        <div>
                          <Label className="text-xs text-gray-400 mb-2 block">대략적인 시간대</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { label: "새벽", time: "새벽 (00:00-06:00)", value: "새벽" },
                              { label: "아침", time: "아침 (06:00-12:00)", value: "아침" },
                              { label: "오후", time: "오후 (12:00-18:00)", value: "오후" },
                              { label: "저녁", time: "저녁 (18:00-24:00)", value: "저녁" }
                            ].map((timeSlot) => (
                              <Button
                                key={timeSlot.value}
                                variant={formData.birthTime === timeSlot.value ? "default" : "outline"}
                                onClick={() => updateFormData("birthTime", timeSlot.value)}
                                className={`h-10 text-sm font-medium ${
                                  formData.birthTime === timeSlot.value
                                    ? "bg-blue-500 text-white hover:bg-blue-600"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-300"
                                }`}
                              >
                                {timeSlot.label}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* 선택된 시간 표시 */}
                      {formData.birthTime && (
                        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-700 font-medium">
                            입력된 시간: {formData.birthTime}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {noBirthTime && (
                    <div className="text-center py-6">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl">❓</span>
                      </div>
                      <p className="text-gray-600">출생시간을 모르시는군요!</p>
                      <p className="text-sm text-gray-500 mt-1">기본값으로 진행하겠습니다.</p>
                    </div>
                  )}
                </div>
              )}

              {step === 6 && (
                <div className="transition-all duration-300 ease-in-out">
                  <Label className="text-sm text-gray-500 mb-4 block">{stepContent.helper}</Label>
                  <div className="flex items-center justify-center space-x-4">
                    <Button
                      onClick={() => updateFormData("handicap", Math.max(0, (formData.handicap || 28) - 1))}
                      className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-xl font-bold"
                    >
                      -
                    </Button>
                    <div className="text-4xl font-bold text-gray-800 min-w-[80px] text-center">
                      {formData.handicap || 28}
                    </div>
                    <Button
                      onClick={() => updateFormData("handicap", Math.min(54, (formData.handicap || 28) + 1))}
                      className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-xl font-bold"
                    >
                      +
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 bg-white h-20 flex-shrink-0">
          <Button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black disabled:opacity-50 h-12 text-base font-medium"
          >
            {step === totalSteps ? "완료" : "다음"}
          </Button>
        </div>
      </div>

      {showSummaryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm mx-4 p-6 animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-center mb-6">입력한 정보를 확인하세요!</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">이름</span>
                <span className="font-medium">{formData.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">휴대폰 번호</span>
                <span className="font-medium">{formData.phoneNumber}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">성별</span>
                <span className="font-medium">{formData.gender}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">생년월일</span>
                <span className="font-medium">{formData.birthDate}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">출생시간</span>
                <span className="font-medium">{formData.birthTime || "모름"}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">핸디캡</span>
                <span className="font-medium">{formData.handicap}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => setShowSummaryModal(false)}
                variant="outline"
                className="h-12 text-base font-medium border-gray-300 hover:bg-gray-50 bg-transparent"
              >
                수정하기
              </Button>
              <Button
                onClick={handleSummaryConfirm}
                className="h-12 text-base font-medium bg-yellow-400 hover:bg-yellow-500 text-black"
              >
                확인
              </Button>
            </div>
          </div>
        </div>
      )}

      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm mx-4 p-6 animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-center mb-6">약관 동의</h3>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700 leading-relaxed">
                메가존의 서비스 이용약관 및 개인정보 처리방침에 동의하는 것으로 간주합니다.
              </p>
            </div>
            <Button
              onClick={handleTermsAgree}
              className="w-full h-12 text-base font-medium bg-yellow-400 hover:bg-yellow-500 text-black"
            >
              동의하고 운세보기
            </Button>
          </div>
        </div>
      )}
    </>
  )
}