import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

export interface UserInfo {
  name: string
  phoneNumber?: string
  birthDate: string
  birthTime: string
  gender: string
  handicap: number
  countryClub?: string
  ironBrand?: string
  driverBrand?: string
  wedgeBrand?: string
  putterBrand?: string
  ballBrand?: string
}

export interface FortuneAnalysis {
  phase: 'analyzing' | 'generating' | 'complete'
  analysis?: {
    personality: string
    golfStyle: string
    luckyElements: string[]
    weakPoints: string[]
    recommendations: string[]
  }
  fortune?: {
    title: string
    luckyClub: string
    luckyBall: string
    luckyHole: string
    luckyItem: string
    luckyTPO: string
    roundFortune: string
    bettingFortune: string
    courseFortune: string
    scoreFortune: string
    strategyFortune: string
    quote: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const userInfo: UserInfo = await request.json()
    
    // 페이즈 2: 사용자 정보 분석
    const analysis = await analyzeUserInfo(userInfo)
    
    // 페이즈 3: OLLAMA를 통한 운세 생성
    const fortune = await generateFortuneWithOllama(userInfo, analysis)
    
    // JSON 형태로 저장
    const result = {
      userInfo,
      analysis,
      fortune,
      timestamp: new Date().toISOString()
    }
    
    // 로컬 저장 (실제로는 DB에 저장)
    const saveResult = await saveUserData(result)
    
    return NextResponse.json({
      phase: 'complete',
      analysis,
      fortune,
      exportInfo: saveResult
    })
    
  } catch (error) {
    console.error('Error in analyze-user API:', error)
    return NextResponse.json(
      { error: 'Failed to analyze user info' },
      { status: 500 }
    )
  }
}

async function analyzeUserInfo(userInfo: UserInfo) {
  try {
    // Python 스크립트를 통해 사주 계산
    const sajuData = await computeSaju(userInfo)
    
    // 사주 데이터를 바탕으로 골프 성격 분석
    const analysis = {
      personality: sajuData.personality,
      golfStyle: sajuData.golf_style,
      luckyElements: Array.isArray(sajuData.lucky_elements) && sajuData.lucky_elements.length > 0 
        ? (Array.isArray(sajuData.lucky_elements[0]) ? sajuData.lucky_elements[0] : sajuData.lucky_elements)
        : ['파랑'], // 색상
      weakPoints: sajuData.weaknesses,
      recommendations: sajuData.recommendations,
      sajuSummary: sajuData.saju_summary,
      element: sajuData.element,
      element_name: sajuData.element_name,
      element_description: sajuData.element_description,
      lucky_numbers: sajuData.lucky_numbers
    }
    
    return analysis
  } catch (error) {
    console.error('사주 계산 오류:', error)
    // 오류 시 기본 분석 반환
    return {
      personality: '활발하고 도전적',
      golfStyle: '균형적',
      luckyElements: ['파랑'],
      weakPoints: ['퍼팅'],
      recommendations: ['충분한 워밍업을 하세요'],
      sajuSummary: '사주 계산 실패',
      element: '木'
    }
  }
}

async function computeSaju(userInfo: UserInfo) {
  try {
    // JavaScript로 사주 계산 구현
    const birthDate = new Date(userInfo.birthDate)
    const year = birthDate.getFullYear()
    const month = birthDate.getMonth() + 1
    const day = birthDate.getDate()
    const hour = parseInt(userInfo.birthTime.split(':')[0])
    
    // 간단한 사주 계산 로직
    const elements = ['木', '火', '土', '金', '水']
    const element = elements[year % 5]
    
    const personalities = [
      '활발하고 도전적',
      '신중하고 안정적', 
      '창의적이고 예술적',
      '논리적이고 분석적',
      '감성적이고 직관적'
    ]
    
    const golfStyles = [
      '공격적',
      '안정적',
      '창의적',
      '전략적',
      '감성적'
    ]
    
    const strengths = [
      ['드라이버', '아이언'],
      ['퍼팅', '아이언'],
      ['웨지', '퍼팅'],
      ['아이언', '드라이버'],
      ['퍼팅', '웨지']
    ]
    
    const weaknesses = [
      ['퍼팅', '멘탈'],
      ['드라이버', '거리'],
      ['아이언', '정확도'],
      ['웨지', '감각'],
      ['드라이버', '아이언']
    ]
    
    const luckyElements = [
      ['파랑', '초록'],
      ['빨강', '주황'],
      ['노랑', '갈색'],
      ['흰색', '회색'],
      ['검정', '보라']
    ]
    
    const recommendations = [
      ['충분한 워밍업을 하세요', '긍정적인 마음가짐을 유지하세요'],
      ['신중한 클럽 선택을 하세요', '안정적인 스윙을 유지하세요'],
      ['창의적인 샷을 시도해보세요', '감각적인 퍼팅을 연습하세요'],
      ['전략적인 코스 관리가 필요합니다', '논리적인 플레이를 하세요'],
      ['직관을 믿고 플레이하세요', '감성적인 골프를 즐기세요']
    ]
    
    const elementIndex = year % 5
    
    return {
      element: element,
      day_gan: "甲",
      month_gan: "甲", 
      year_gan: "甲",
      day_zhi: "子",
      hour_gan: "甲",
      hour_zhi: "子",
      lunar_date: `${year}년 ${month}월 ${day}일`,
      solar_date: userInfo.birthDate,
      saju_summary: `${element} 오행의 기운을 가진 ${personalities[elementIndex]}한 성격`,
      personality: personalities[elementIndex],
      golf_style: golfStyles[elementIndex],
      strengths: strengths[elementIndex],
      weaknesses: weaknesses[elementIndex],
      lucky_elements: luckyElements[elementIndex],
      recommendations: recommendations[elementIndex],
      element_name: `${element} - ${element === '木' ? '나무' : element === '火' ? '불' : element === '土' ? '흙' : element === '金' ? '금' : '물'}의 기운`,
      element_description: element === '木' ? '성장과 발전의 기운' : 
                          element === '火' ? '열정과 활력의 기운' :
                          element === '土' ? '안정과 신뢰의 기운' :
                          element === '金' ? '정의와 결단의 기운' : '지혜와 유연성의 기운',
      lucky_numbers: [elementIndex + 1, elementIndex + 6]
    }
  } catch (error) {
    console.error('사주 계산 오류:', error)
    // 기본값 반환
    return {
      element: "木",
      day_gan: "甲",
      month_gan: "甲",
      year_gan: "甲", 
      day_zhi: "子",
      hour_gan: "甲",
      hour_zhi: "子",
      lunar_date: "기본값",
      solar_date: "기본값",
      saju_summary: "기본 사주",
      personality: "활발하고 도전적",
      golf_style: "균형적",
      strengths: ["드라이버"],
      weaknesses: ["퍼팅"],
      lucky_elements: ["파랑"],
      recommendations: ["충분한 워밍업을 하세요"],
      element_name: "목(木) - 나무의 기운",
      element_description: "성장과 발전의 기운",
      lucky_numbers: [3, 8]
    }
  }
}

async function generateFortuneWithOllama(userInfo: UserInfo, analysis: any) {
  try {
    console.log('OLLAMA 모델 호출 시작...')
    
    // OLLAMA API 호출
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'golf-fortune',
        prompt: createFortunePrompt(userInfo, analysis),
        stream: false
      })
    })

    if (!response.ok) {
      throw new Error(`OLLAMA API 오류: ${response.status}`)
    }

    const data = await response.json()
    console.log('OLLAMA 응답:', data.response)
    
    // 응답 파싱
    const fortune = parseFortuneResponse(data.response, userInfo, analysis)
    console.log('파싱된 운세:', fortune)
    
    return fortune
    
  } catch (error) {
    console.error('OLLAMA 운세 생성 오류:', error)
    // 오류 시 기본 운세 반환
    return generateDefaultFortune(userInfo, analysis)
  }
}

function createFortunePrompt(userInfo: UserInfo, analysis: any): string {
  return `당신은 골프의 신 '골신' 할아버지입니다. 100년 넘게 골프를 지켜본 신선으로서, 사용자의 운세를 봐주세요.

=== 사용자 정보 ===
- 이름: ${userInfo.name}
- 생년월일: ${userInfo.birthDate}
- 성별: ${userInfo.gender}
- 핸디캡: ${userInfo.handicap}
- 방문 예정 CC: ${userInfo.get?.('countryClub') || '미정'}

=== 사주 분석 결과 ===
- 사주: ${analysis.saju_summary || '기본 사주'}
- 오행: ${analysis.element || '木'} (${analysis.element_name || '목'})
- 성격: ${analysis.personality || '활발하고 도전적'}
- 골프 스타일: ${analysis.golf_style || '균형적'}
- 강점: ${Array.isArray(analysis.strengths) ? analysis.strengths.join(', ') : analysis.strengths || '드라이버'}
- 약점: ${Array.isArray(analysis.weaknesses) ? analysis.weaknesses.join(', ') : analysis.weaknesses || '퍼팅'}
- 행운 요소: ${Array.isArray(analysis.lucky_elements) ? analysis.lucky_elements.join(', ') : analysis.lucky_elements || '파랑'}
- 행운의 클럽: ${analysis.lucky_club || '아이언'}
- 행운의 볼: ${analysis.lucky_ball || '타이틀리스트 Pro V1'}
- 행운의 TPO: ${analysis.lucky_tpo || '청색 상의'}

=== 요청사항 ===
골신 할아버지 톤으로 다음 형식에 맞춰 운세를 작성해주세요:

[인사말]
좋네… 자네 ${userInfo.name}의 운세를 보자고 했지?
생년월일 보니, ${userInfo.birthDate}생… ${userInfo.birthTime || '낮'}에 태어난 ${userInfo.gender}라구? 음, 기운이 뚜렷하네.

:골프를_치는_${userInfo.gender}: 전반 기류
[올해 골프 운세에 대한 전반적인 이야기 - 3-4문장]

:대체로_맑음: 세부 운세

멘탈 운
[멘탈 관리에 대한 운세 - 2-3문장]

기술 운
[기술적 측면의 운세 - 2-3문장]

체력 운
[체력과 건강에 대한 운세 - 2-3문장]

인맥 운
[인간관계와 동반자에 대한 운세 - 2-3문장]

:골프: 종합
[올해 전체적인 메시지와 조언 - 3-4문장]

[마무리 한줄]
허허, 그러니 너무 조급해 말고… [간단한 조언 한 문장]

=== 작성 규칙 ===
- 할아버지 톤으로 "자네", "~라네", "~구먼", "~걸세" 사용
- 사주 정보를 자연스럽게 언급하면서 운세 설명
- 현실적이면서도 희망적인 조언 제공
- 과도한 확정 표현은 피하고, "~일 걸세", "~할 거라네" 등 사용
- 이모지는 적절히 사용하되 과하지 않게`
}

function parseFortuneResponse(response: string, userInfo: UserInfo, analysis: any) {
  try {
    console.log('OLLAMA 응답:', response)
    
    // 골신 할아버지 스타일 응답 파싱
    const greetingMatch = response.match(/좋네…[\s\S]*?기운이 뚜렷하네\./i)
    const generalMatch = response.match(/:골프를_치는_[^:]+:\s*전반\s*기류\s*([\s\S]*?)(?=:대체로_맑음:|$)/i)
    const mentalMatch = response.match(/멘탈\s*운\s*([\s\S]*?)(?=기술\s*운|$)/i)
    const skillMatch = response.match(/기술\s*운\s*([\s\S]*?)(?=체력\s*운|$)/i)
    const healthMatch = response.match(/체력\s*운\s*([\s\S]*?)(?=인맥\s*운|$)/i)
    const networkMatch = response.match(/인맥\s*운\s*([\s\S]*?)(?=:골프:\s*종합|$)/i)
    const summaryMatch = response.match(/:골프:\s*종합\s*([\s\S]*?)(?=\[마무리|$)/i)
    const finalMatch = response.match(/허허, 그러니 너무 조급해 말고…\s*([\s\S]*?)$/i)
    
    console.log('골신 응답 파싱 결과:')
    console.log('인사말:', greetingMatch ? '매칭됨' : '매칭 안됨')
    console.log('전반 기류:', generalMatch ? '매칭됨' : '매칭 안됨')
    console.log('멘탈 운:', mentalMatch ? '매칭됨' : '매칭 안됨')
    console.log('기술 운:', skillMatch ? '매칭됨' : '매칭 안됨')
    console.log('체력 운:', healthMatch ? '매칭됨' : '매칭 안됨')
    console.log('인맥 운:', networkMatch ? '매칭됨' : '매칭 안됨')
    console.log('종합:', summaryMatch ? '매칭됨' : '매칭 안됨')
    console.log('마무리:', finalMatch ? '매칭됨' : '매칭 안됨')
    
    // 동적 행운 아이템 생성
    const luckyClub = analysis?.lucky_club || getLuckyClubFromStrengths(analysis?.strengths)
    const luckyBall = analysis?.lucky_ball || getLuckyBallFromColors(analysis?.lucky_elements)
    const luckyTPO = analysis?.lucky_tpo || getLuckyTPOFromColors(analysis?.lucky_elements)
    const luckyHole = getLuckyHoleFromNumbers(analysis?.lucky_numbers)
    const luckyItem = getLuckyItemFromElement(analysis?.element)
    
    return {
      title: response, // 전체 골신 할아버지 응답을 title로 사용
      luckyClub: luckyClub,
      luckyBall: luckyBall,
      luckyHole: luckyHole,
      luckyItem: luckyItem,
      luckyTPO: luckyTPO,
      roundFortune: generalMatch ? generalMatch[1].trim() : "올해는 기초를 다지는 해가 될 것 같네요.",
      bettingFortune: mentalMatch ? mentalMatch[1].trim() : "멘탈이 절반이라네. 긍정적인 마음가짐을 유지하세요.",
      strategyFortune: skillMatch ? skillMatch[1].trim() : "기술적 측면에서 꾸준한 연습이 필요하겠네요.",
      scoreFortune: healthMatch ? healthMatch[1].trim() : "체력 관리가 중요한 한 해가 될 것 같습니다.",
      courseFortune: networkMatch ? networkMatch[1].trim() : "좋은 동반자와 함께하는 골프가 운을 높일 거라네.",
      quote: finalMatch ? finalMatch[1].trim() : "오늘도 즐거운 라운드 되세요."
    }
  } catch (error) {
    console.error('응답 파싱 오류:', error)
    return generateDefaultFortune(userInfo, analysis)
  }
}

// 동적 행운 아이템 생성 함수들
function getLuckyClubFromStrengths(strengths: string[]) {
  if (!Array.isArray(strengths)) return '아이언'
  if (strengths.includes('드라이버')) return '드라이버'
  if (strengths.includes('아이언')) return '아이언'
  if (strengths.includes('퍼팅')) return '퍼터'
  if (strengths.includes('웨지')) return '웨지'
  return '아이언'
}

function getLuckyBallFromColors(colors: string[]) {
  if (!Array.isArray(colors)) return '타이틀리스트 Pro V1'
  const color = colors[0] || '파랑'
  const ballMap = {
    '파랑': '타이틀리스트 Pro V1',
    '빨강': '테일러메이드 TP5',
    '초록': '브리지스톤 B XS',
    '노랑': '콜웨이 ERC Soft',
    '검정': '윌슨 Staff Model',
    '흰색': '스릭슨 Z-STAR'
  }
  return ballMap[color] || '타이틀리스트 Pro V1'
}

function getLuckyTPOFromColors(colors: string[]) {
  if (!Array.isArray(colors)) return '청색 상의, 하얀색 하의'
  const color = colors[0] || '파랑'
  const tpoMap = {
    '파랑': '청색 상의, 하얀색 하의',
    '빨강': '빨간색 상의, 검은색 하의',
    '초록': '초록색 상의, 하얀색 하의',
    '노랑': '노란색 상의, 검은색 하의',
    '검정': '검은색 상의, 하얀색 하의',
    '흰색': '하얀색 상의, 검은색 하의'
  }
  return tpoMap[color] || '청색 상의, 하얀색 하의'
}

function getLuckyHoleFromNumbers(numbers: number[]) {
  if (!Array.isArray(numbers) || numbers.length === 0) return '5번홀'
  return `${numbers[0]}번홀`
}

function getLuckyItemFromElement(element: string) {
  const itemMap = {
    '木': '거리측정기',
    '火': '골프 모자',
    '土': '골프 장갑',
    '金': '골프 시계',
    '水': '골프 우산'
  }
  return itemMap[element] || '거리측정기'
}

function generateDefaultFortune(userInfo: UserInfo | null, analysis: any) {
  if (!userInfo || !analysis) {
    return {
      title: "오늘은 신중하게 플레이하세요",
      luckyClub: "퍼터",
      luckyBall: "타이틀리스트",
      luckyHole: "9번홀",
      luckyItem: "거리측정기",
      luckyTPO: "청색 상의, 하얀색 하의",
      roundFortune: "오늘은 차분하게 플레이하는 것이 중요합니다.",
      bettingFortune: "작은 내기만 하세요.",
      courseFortune: "평지 코스가 좋겠습니다.",
      scoreFortune: "평소보다 2-3타 높게 잡으세요.",
      strategyFortune: "안전한 플레이를 선택하세요.",
      quote: "골프는 마음의 게임입니다."
    }
  }

  // 개인화된 운세 생성
  const getLuckyClub = () => {
    if (analysis?.strengths?.includes('드라이버')) return '드라이버'
    if (analysis?.strengths?.includes('아이언')) return '아이언'
    if (analysis?.strengths?.includes('퍼팅')) return '퍼터'
    if (analysis?.strengths?.includes('웨지')) return '웨지'
    return '아이언'
  }
  
  const getLuckyBall = () => {
    const colors = analysis?.lucky_elements || ['파랑']
    if (colors.includes('파랑')) return '타이틀리스트 Pro V1'
    if (colors.includes('빨강')) return '테일러메이드 TP5'
    if (colors.includes('초록')) return '브리지스톤 B XS'
    if (colors.includes('노랑')) return '콜웨이 ERC Soft'
    return '타이틀리스트 Pro V1'
  }
  
  const getLuckyHole = () => {
    const luckyNumbers = analysis?.lucky_numbers || [3, 8]
    return `${luckyNumbers[0]}번홀`
  }
  
  const getLuckyTPO = () => {
    const colors = analysis?.lucky_elements || ['파랑']
    const color = colors[0]
    const colorMap = {
      '파랑': '청색 상의, 하얀색 하의',
      '빨강': '빨간색 상의, 검은색 하의',
      '초록': '초록색 상의, 하얀색 하의',
      '노랑': '노란색 상의, 검은색 하의',
      '흰색': '하얀색 상의, 검은색 하의'
    }
    return colorMap[color] || '청색 상의, 하얀색 하의'
  }
  
  const getHandicapLevel = (handicap: number) => {
    if (handicap < 10) return "싱글"
    if (handicap < 20) return "중급"
    return "초심자"
  }
  
  const level = getHandicapLevel(userInfo.handicap)
  const personality = analysis?.personality || '활발하고 도전적'
  const golfStyle = analysis?.golf_style || '균형적'
  const strengths = analysis?.strengths || ['드라이버']
  const weaknesses = analysis?.weaknesses || ['퍼팅']
  
  return {
    title: `${userInfo.name}님의 오늘 골프 운세`,
    luckyClub: getLuckyClub(),
    luckyBall: getLuckyBall(),
    luckyHole: getLuckyHole(),
    luckyItem: "거리측정기",
    luckyTPO: getLuckyTPO(),
    roundFortune: `${personality}한 성격으로 ${golfStyle}한 플레이가 좋겠습니다.`,
    bettingFortune: `${level} 레벨에 맞는 작은 내기만 하세요. ${strengths[0]}이 강점이니 이를 활용하세요.`,
    courseFortune: `${analysis?.element || '목'} 오행의 기운에 맞는 코스를 선택하세요. ${userInfo.countryClub || '평지 코스'}가 좋겠습니다.`,
    scoreFortune: `${level} 레벨에 맞는 목표를 설정하세요. ${weaknesses[0]}을 보완하는 연습이 필요합니다.`,
    strategyFortune: `${strengths[0]}을 활용하고 ${weaknesses[0]}을 보완하는 전략으로 플레이하세요.`,
    quote: `${personality}한 마음으로 골프를 즐기세요. ${analysis?.element_name || '목의 기운'}이 당신을 응원합니다.`
  }
}

function generateLuckyElements(userInfo: UserInfo): string[] {
  const elements = ['물', '나무', '불', '흙', '금']
  const birthMonth = parseInt(userInfo.birthDate.split('.')[1])
  return [elements[birthMonth % 5]]
}

function generateWeakPoints(userInfo: UserInfo): string[] {
  const points = ['퍼팅', '드라이버', '아이언', '샌드웨지', '멘탈']
  return [points[userInfo.handicap % 5]]
}

function generateRecommendations(userInfo: UserInfo): string[] {
  return [
    '충분한 워밍업을 하세요',
    '집중력을 높이세요',
    '긍정적인 마음가짐을 유지하세요'
  ]
}

async function saveUserData(data: any) {
  try {
    // 데이터 저장 디렉토리 생성
    const dataDir = path.join(process.cwd(), 'data', 'users')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    // 파일명 생성 (타임스탬프 + 사용자명)
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const fileName = `${timestamp}_${data.userInfo.name}.json`
    const filePath = path.join(dataDir, fileName)

    // 사용자 정보를 JSON 파일로 저장
    const userData = {
      timestamp: data.timestamp,
      userInfo: data.userInfo,
      analysis: data.analysis,
      fortune: data.fortune,
      exportInfo: {
        exportedAt: new Date().toISOString(),
        exportPath: filePath,
        exportFormat: 'JSON'
      }
    }

    fs.writeFileSync(filePath, JSON.stringify(userData, null, 2), 'utf8')
    
    console.log('사용자 데이터 저장 완료:', filePath)
    
    // CSV 형태로도 저장 (스프레드시트 호환)
    const csvFileName = `${timestamp}_${data.userInfo.name}.csv`
    const csvFilePath = path.join(dataDir, csvFileName)
    
    const csvData = generateCSVData(data.userInfo, data.analysis, data.fortune)
    fs.writeFileSync(csvFilePath, csvData, 'utf8')
    
    console.log('CSV 데이터 저장 완료:', csvFilePath)
    
    return {
      jsonPath: filePath,
      csvPath: csvFilePath,
      success: true
    }
  } catch (error) {
    console.error('데이터 저장 오류:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

function generateCSVData(userInfo: UserInfo, analysis: any, fortune: any): string {
  const headers = [
    '이름', '휴대폰번호', '생년월일', '출생시간', '성별', '핸디캡',
    '방문CC', '아이언', '드라이버', '웨지', '퍼터', '볼',
    '사주요약', '오행', '성격', '골프스타일', '행운요소', '약점',
    '운세제목', '행운클럽', '행운볼', '행운홀', '행운아이템', '행운TPO'
  ]
  
  const values = [
    userInfo.name,
    userInfo.phoneNumber || '',
    userInfo.birthDate,
    userInfo.birthTime,
    userInfo.gender,
    userInfo.handicap.toString(),
    userInfo.countryClub || '',
    userInfo.ironBrand || '',
    userInfo.driverBrand || '',
    userInfo.wedgeBrand || '',
    userInfo.putterBrand || '',
    userInfo.ballBrand || '',
    analysis.sajuSummary || '',
    analysis.element || '',
    analysis.personality || '',
    analysis.golfStyle || '',
    Array.isArray(analysis.luckyElements) ? analysis.luckyElements.join(', ') : '',
    Array.isArray(analysis.weakPoints) ? analysis.weakPoints.join(', ') : '',
    fortune.title || '',
    fortune.luckyClub || '',
    fortune.luckyBall || '',
    fortune.luckyHole || '',
    fortune.luckyItem || '',
    fortune.luckyTPO || ''
  ]
  
  return headers.join(',') + '\n' + values.map(v => `"${v}"`).join(',') + '\n'
}
