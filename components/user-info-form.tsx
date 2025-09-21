"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
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
  const [noCountryClub, setNoCountryClub] = useState(false)
  const [wantsAdditionalInfo, setWantsAdditionalInfo] = useState(false)
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false)

  const basicSteps = 6 // 기본 6단계: 이름, 휴대폰번호, 성별, 생년월일, 출생시간, 핸디캡
  const additionalSteps = 1 // 추가 정보 1단계: 브랜드 선택 (CC + 아이언 + 드라이버 + 퍼터)
  const totalSteps = basicSteps + (wantsAdditionalInfo ? additionalSteps : 0)

  // 골프 브랜드 옵션들 (가나다 순)
  const golfBrands = [
    "기타",
    "네이키",
    "데이비드 글로브",
    "마이크로스",
    "미즈노",
    "브리지스톤",
    "시리우스",
    "아이언맨",
    "알디라",
    "에픽",
    "오디세이",
    "윌슨",
    "캘러웨이",
    "카본",
    "코브라",
    "타이틀리스트",
    "테일러메이드",
    "핑",
  ]

  const handleNext = () => {
    if (step === basicSteps) {
      // 기본 정보 완료 후 추가 정보 질문
      setShowAdditionalInfo(true)
    } else if (step < totalSteps) {
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

  const handleAdditionalInfoYes = () => {
    setShowAdditionalInfo(false)
    setWantsAdditionalInfo(true)
    setStep(7) // 브랜드 선택 단계로
  }

  const handleAdditionalInfoNo = () => {
    setShowAdditionalInfo(false)
    setWantsAdditionalInfo(false)
    setShowSummaryModal(true)
  }

  const handleSummaryConfirm = () => {
    setShowSummaryModal(false)
    setShowTermsModal(true)
  }

  const handleSummaryEdit = () => {
    setShowSummaryModal(false)
    setStep(wantsAdditionalInfo ? 7 : 6) // 마지막 단계로 이동하여 수정 가능
  }

  const handleTermsAccept = () => {
    setShowTermsModal(false)
    console.log("[v0] 입력된 사용자 정보:", formData)
    onComplete(formData as UserInfo)
  }

  const updateFormData = (field: keyof UserInfo, value: any) => {
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

  const getFieldName = (step: number): keyof UserInfo => {
    switch (step) {
      case 7: return "countryClub" // 브랜드 선택 단계에서는 countryClub만 사용
      default: return "name"
    }
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
      case 7: // 브랜드 선택
        return true // 브랜드 선택은 모두 선택사항
      default:
        return false
    }
  }

  const getStepContent = () => {
    switch (step) {
      case 1:
        return {
          title: "골신에게 운세를 볼 당신의\n이름은?",
          subtitle: "이름",
          placeholder: "이름을 적어 주세요",
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
          helper: "대운의 시기는 성별에 따라 달라요!",
        }
      case 4:
        return {
          title: `${formData.name || "김선우"}님의\n생년월일을 알려주세요.`,
          subtitle: "생년월일 (양력, 음력)",
          helper: "사주분석은 만 나이로 적용돼요",
          placeholder: "1999.01.01",
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
      case 7:
        return {
          title: `${formData.name || "김선우"}님의\n골프 장비 정보를 알려주세요`,
          subtitle: "브랜드 선택",
        }
      default:
        return { title: "", subtitle: "", placeholder: "" }
    }
  }

  const stepContent = getStepContent()

  return (
    <>
      {/* 추가 정보 질문 모달 */}
      {showAdditionalInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm mx-4 p-6 animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-center mb-4">추가 정보를 작성해주시면<br/>운세가 더 정확해져요!</h3>
            <p className="text-gray-600 text-center mb-8">오늘 방문하는 CC, 클럽 정보 등...</p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleAdditionalInfoNo}
                variant="outline"
                className="h-12 text-base font-medium border-gray-300 hover:bg-gray-50 bg-transparent"
              >
                아니오
              </Button>
              <Button
                onClick={handleAdditionalInfoYes}
                className="h-12 text-base font-medium bg-yellow-400 hover:bg-yellow-500 text-black"
              >
                예
              </Button>
            </div>
          </div>
        </div>
      )}

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

        <div className={`flex-1 px-6 py-8 flex flex-col ${step === 7 ? 'justify-start' : 'justify-center'}`}>
          <div className={`w-full ${step === 7 ? 'h-full overflow-y-auto' : ''}`}>
            <div className={`${step === 7 ? 'h-16 mb-4 flex-shrink-0' : 'h-32 mb-8'}`}>
              <h2 className="text-2xl font-bold text-gray-900 leading-tight whitespace-pre-line">
                {stepContent.title}
              </h2>
            </div>

            <div className={`${step === 7 ? 'flex-1 min-h-0' : 'h-40'}`}>
              {step === 1 && (
                <div className="transition-all duration-300 ease-in-out">
                  <Label className="text-sm text-gray-500 mb-2 block">{stepContent.subtitle}</Label>
                  <Input
                    value={formData.name || ""}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    placeholder={stepContent.placeholder}
                    className="border-0 border-b-2 border-gray-200 rounded-none bg-transparent px-0 py-4 text-lg focus:border-blue-600 focus:ring-0 placeholder:text-gray-400 w-full"
                  />
                </div>
              )}

              {step === 2 && (
                <div className="transition-all duration-300 ease-in-out">
                  <Label className="text-sm text-gray-500 mb-2 block">{stepContent.subtitle}</Label>
                  <Input
                    value={formData.phoneNumber || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '')
                      const formatted = value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
                      updateFormData("phoneNumber", formatted)
                    }}
                    placeholder={stepContent.placeholder}
                    maxLength={13}
                    className="border-0 border-b-2 border-gray-200 rounded-none bg-transparent px-0 py-4 text-lg focus:border-blue-600 focus:ring-0 placeholder:text-gray-400 w-full"
                  />
                </div>
              )}

              {step === 3 && (
                <div className="transition-all duration-300 ease-in-out">
                  <Label className="text-sm text-gray-500 mb-4 block">{stepContent.helper}</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant={formData.gender === "남자" ? "default" : "outline"}
                      onClick={() => updateFormData("gender", "남자")}
                      className={`h-14 text-lg font-medium ${
                        formData.gender === "남자"
                          ? "bg-black text-white hover:bg-gray-800"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-0"
                      }`}
                    >
                      남자
                    </Button>
                    <Button
                      variant={formData.gender === "여자" ? "default" : "outline"}
                      onClick={() => updateFormData("gender", "여자")}
                      className={`h-14 text-lg font-medium ${
                        formData.gender === "여자"
                          ? "bg-black text-white hover:bg-gray-800"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-0"
                      }`}
                    >
                      여자
                    </Button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="transition-all duration-300 ease-in-out">
                  <Label className="text-sm text-gray-500 mb-4 block">{stepContent.helper}</Label>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Input
                        value={formData.birthDate || ""}
                        onChange={handleBirthDateChange}
                        placeholder={stepContent.placeholder}
                        maxLength={10}
                        className="border-0 border-b-2 border-gray-200 rounded-none bg-transparent px-0 py-4 text-lg focus:border-blue-600 focus:ring-0 placeholder:text-gray-400 flex-1 mr-4"
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-black text-white hover:bg-gray-800 px-4 py-1 text-sm"
                        >
                          양력
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-gray-100 text-gray-600 hover:bg-gray-200 border-0 px-4 py-1 text-sm"
                        >
                          음력
                        </Button>
                      </div>
                    </div>
                    <Label className="text-xs text-gray-400">생년월일 8자리</Label>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="transition-all duration-300 ease-in-out">
                  <Label className="text-sm text-gray-500 mb-4 block">{stepContent.subtitle}</Label>
                  
                  {/* 간단한 시간 선택 */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <Button
                        variant={!noBirthTime ? "default" : "outline"}
                        onClick={() => setNoBirthTime(false)}
                        className={`h-12 text-base font-medium ${
                          !noBirthTime
                            ? "bg-black text-white hover:bg-gray-800"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-0"
                        }`}
                      >
                        알고 있어요
                      </Button>
                      <Button
                        variant={noBirthTime ? "default" : "outline"}
                        onClick={() => setNoBirthTime(true)}
                        className={`h-12 text-base font-medium ${
                          noBirthTime
                            ? "bg-black text-white hover:bg-gray-800"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-0"
                        }`}
                      >
                        모르겠어요
                      </Button>
                    </div>

                    {!noBirthTime && (
                      <div className="space-y-3">
                        <Label className="text-sm text-gray-500">출생시간을 선택해주세요</Label>
                        
                        {/* 시간대 토글 */}
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
                              className={`h-12 text-sm font-medium ${
                                formData.birthTime === timeSlot.value
                                  ? "bg-blue-500 text-white hover:bg-blue-600"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-300"
                              }`}
                            >
                              {timeSlot.label}
                            </Button>
                          ))}
                        </div>
                        
                        {/* 선택된 시간대 표시 */}
                        {formData.birthTime && (
                          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <span className="text-sm text-blue-700 font-medium">
                              선택: {formData.birthTime} 시간대
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {noBirthTime && (
                      <div className="text-center py-6">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-2xl">❓</span>
                        </div>
                        <p className="text-gray-600 text-sm">출생시간을 모르셔도<br/>기본 사주로 분석해드려요!</p>
                      </div>
                    )}
                  </div>
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

              {step === 7 && (
                <div className="transition-all duration-300 ease-in-out space-y-4 pb-4 h-full overflow-y-auto">
                  {/* 방문 예정 CC */}
                  <div>
                    <Label className="text-sm text-gray-500 mb-2 block">방문 예정인 CC가 있으신가요?</Label>
                    <Input
                      value={noCountryClub ? "" : formData.countryClub || ""}
                      onChange={(e) => updateFormData("countryClub", e.target.value)}
                      disabled={noCountryClub}
                      placeholder="골프장 이름을 입력해주세요"
                      className="border-0 border-b-2 border-gray-200 rounded-none bg-transparent px-0 py-3 text-base focus:border-blue-600 focus:ring-0 placeholder:text-gray-400 disabled:opacity-50 w-full"
                    />
                    <div className="flex items-center space-x-2 mt-2">
                      <Checkbox
                        id="no-country-club"
                        checked={noCountryClub}
                        onCheckedChange={(checked) => {
                          setNoCountryClub(checked as boolean)
                          if (checked) {
                            updateFormData("countryClub", "없어요")
                          }
                        }}
                        className="border-2 border-gray-400 data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400"
                      />
                      <Label htmlFor="no-country-club" className="text-sm text-gray-600">
                        없어요
                      </Label>
                    </div>
                  </div>

                  {/* 아이언 브랜드 */}
                  <div>
                    <Label className="text-sm text-gray-500 mb-2 block">내 아이언 브랜드</Label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {golfBrands.map((brand) => (
                        <Button
                          key={`iron-${brand}`}
                          variant={formData.ironBrand === brand ? "default" : "outline"}
                          onClick={() => updateFormData("ironBrand", brand)}
                          className={`h-8 text-xs ${
                            formData.ironBrand === brand
                              ? "bg-black text-white hover:bg-gray-800"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-0"
                          }`}
                        >
                          {brand}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* 드라이버 브랜드 */}
                  <div>
                    <Label className="text-sm text-gray-500 mb-2 block">내 드라이버 브랜드</Label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {golfBrands.map((brand) => (
                        <Button
                          key={`driver-${brand}`}
                          variant={formData.driverBrand === brand ? "default" : "outline"}
                          onClick={() => updateFormData("driverBrand", brand)}
                          className={`h-8 text-xs ${
                            formData.driverBrand === brand
                              ? "bg-black text-white hover:bg-gray-800"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-0"
                          }`}
                        >
                          {brand}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* 퍼터 브랜드 */}
                  <div>
                    <Label className="text-sm text-gray-500 mb-2 block">내 퍼터 브랜드</Label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {golfBrands.map((brand) => (
                        <Button
                          key={`putter-${brand}`}
                          variant={formData.putterBrand === brand ? "default" : "outline"}
                          onClick={() => updateFormData("putterBrand", brand)}
                          className={`h-8 text-xs ${
                            formData.putterBrand === brand
                              ? "bg-black text-white hover:bg-gray-800"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-0"
                          }`}
                        >
                          {brand}
                        </Button>
                      ))}
                    </div>
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
            {step === basicSteps ? "다음" : step === totalSteps ? "완료" : "다음"}
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
                <span className="font-medium">{formData.birthTime}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">핸디캡</span>
                <span className="font-medium">{formData.handicap}</span>
              </div>
              {formData.countryClub && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">방문하는 CC</span>
                  <span className="font-medium">{formData.countryClub}</span>
                </div>
              )}
              {formData.ironBrand && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">아이언</span>
                  <span className="font-medium">{formData.ironBrand}</span>
                </div>
              )}
              {formData.driverBrand && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">드라이버</span>
                  <span className="font-medium">{formData.driverBrand}</span>
                </div>
              )}
              {formData.putterBrand && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">퍼터</span>
                  <span className="font-medium">{formData.putterBrand}</span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleSummaryEdit}
                variant="outline"
                className="h-12 text-base font-medium border-gray-300 hover:bg-gray-50 bg-transparent"
              >
                수정할래요
              </Button>
              <Button
                onClick={handleSummaryConfirm}
                className="h-12 text-base font-medium bg-yellow-400 hover:bg-yellow-500 text-black"
              >
                맞아요
              </Button>
            </div>
          </div>
        </div>
      )}

      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-2xl w-full max-w-sm p-6 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">이용약관 동의</h3>
              <button onClick={() => setShowTermsModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              아래 시작하기를 누르면 메가존의 <span className="underline">서비스 이용약관</span> 및{" "}
              <span className="underline">개인정보 처리방침</span>에 동의하는 것으로 간주합니다.
            </p>
            <Button
              onClick={handleTermsAccept}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black h-12 text-base font-medium"
            >
              시작하기
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

// TimePicker 컴포넌트
interface TimePickerProps {
  value: string
  onChange: (time: string) => void
}

function TimePicker({ value, onChange }: TimePickerProps) {
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM')
  const [hour, setHour] = useState(12)
  const [minute, setMinute] = useState(0)

  useEffect(() => {
    if (value) {
      // 24시간 형식을 12시간 형식으로 변환
      const [h, m] = value.split(':').map(Number)
      if (h === 0) {
        setPeriod('AM')
        setHour(12)
      } else if (h < 12) {
        setPeriod('AM')
        setHour(h)
      } else if (h === 12) {
        setPeriod('PM')
        setHour(12)
      } else {
        setPeriod('PM')
        setHour(h - 12)
      }
      setMinute(m || 0)
    }
  }, [value])

  const handleTimeChange = (newPeriod: 'AM' | 'PM', newHour: number, newMinute: number) => {
    setPeriod(newPeriod)
    setHour(newHour)
    setMinute(newMinute)
    
    // 12시간 형식을 24시간 형식으로 변환
    let hour24 = newHour
    if (newPeriod === 'AM' && newHour === 12) {
      hour24 = 0
    } else if (newPeriod === 'PM' && newHour !== 12) {
      hour24 = newHour + 12
    }
    
    const timeString = `${hour24.toString().padStart(2, '0')}:${newMinute.toString().padStart(2, '0')}`
    onChange(timeString)
  }

  const hours = Array.from({ length: 12 }, (_, i) => i + 1)
  const minutes = Array.from({ length: 60 }, (_, i) => i)

  return (
    <div className="space-y-6">
      {/* 오전/오후 선택 - 평탄화 */}
      <div className="flex justify-center">
        <div className="bg-gray-50 rounded-lg p-1 flex w-full max-w-xs">
          <button
            onClick={() => handleTimeChange('AM', hour, minute)}
            className={`flex-1 py-3 text-sm font-medium transition-all rounded-md ${
              period === 'AM'
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            오전
          </button>
          <button
            onClick={() => handleTimeChange('PM', hour, minute)}
            className={`flex-1 py-3 text-sm font-medium transition-all rounded-md ${
              period === 'PM'
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            오후
          </button>
        </div>
      </div>

      {/* 시간 선택 - 개선된 스크롤 */}
      <div className="flex justify-center space-x-6">
        {/* 시간 */}
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-3 font-medium">시간</div>
          <div className="w-16 h-40 overflow-y-auto scrollbar-hide border border-gray-200 rounded-lg bg-white shadow-sm">
            <div className="py-2">
              {hours.map((h) => (
                <button
                  key={h}
                  onClick={() => handleTimeChange(period, h, minute)}
                  className={`w-full py-3 text-sm font-medium transition-colors border-b border-gray-100 last:border-b-0 ${
                    hour === h
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {h.toString().padStart(2, '0')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 분 */}
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-3 font-medium">분</div>
          <div className="w-16 h-40 overflow-y-auto scrollbar-hide border border-gray-200 rounded-lg bg-white shadow-sm">
            <div className="py-2">
              {minutes.map((m) => (
                <button
                  key={m}
                  onClick={() => handleTimeChange(period, hour, m)}
                  className={`w-full py-2 text-xs font-medium transition-colors border-b border-gray-100 last:border-b-0 ${
                    minute === m
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {m.toString().padStart(2, '0')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 선택된 시간 표시 - 평탄화 */}
      <div className="text-center">
        <div className="inline-block bg-gray-50 px-4 py-2 rounded-lg">
          <div className="text-sm font-medium text-gray-700">
            {period} {hour.toString().padStart(2, '0')}:{minute.toString().padStart(2, '0')}
          </div>
        </div>
      </div>
    </div>
  )
}