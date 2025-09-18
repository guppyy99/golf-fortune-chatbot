import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
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
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(process.cwd(), 'lib', 'compute_saju.py')
    const python = spawn('python3', [pythonScript])
    
    let dataString = ''
    let errorString = ''
    
    python.stdout.on('data', (data) => {
      dataString += data.toString()
    })
    
    python.stderr.on('data', (data) => {
      errorString += data.toString()
    })
    
    python.on('close', (code) => {
      if (code !== 0) {
        console.error('Python script error:', errorString)
        // 오류 시에도 기본값으로 진행
        resolve({
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
        })
        return
      }
      
      try {
        const result = JSON.parse(dataString)
        console.log('사주 계산 성공:', result)
        resolve(result)
      } catch (error) {
        console.error('JSON 파싱 오류:', error, 'Raw data:', dataString)
        reject(new Error(`Failed to parse Python output: ${errorString}`))
      }
    })
    
    // 사용자 정보를 Python 스크립트에 전달
    python.stdin.write(JSON.stringify(userInfo))
    python.stdin.end()
  })
}

async function generateFortuneWithOllama(userInfo: UserInfo, analysis: any) {
  try {
    // OLLAMA API 호출
    const prompt = createFortunePrompt(userInfo, analysis)
    
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dynk/mz1', // 사용자 정의 모델
        prompt: prompt,
        stream: false
      })
    })
    
    if (!response.ok) {
      throw new Error('OLLAMA API 호출 실패')
    }
    
    const data = await response.json()
    const fortuneText = data.response
    
    // 응답을 구조화된 데이터로 파싱
    return parseFortuneResponse(fortuneText)
    
  } catch (error) {
    console.error('OLLAMA API 오류:', error)
    // OLLAMA 실패 시 기본 운세 반환
    return generateDefaultFortune(userInfo, analysis)
  }
}

function createFortunePrompt(userInfo: UserInfo, analysis: any): string {
  // 핸디캡에 따른 레벨 분류
  const getLevel = (handicap: number) => {
    if (handicap < 10) return "싱글"
    if (handicap < 20) return "중급"
    return "초심자"
  }

  const level = getLevel(userInfo.handicap)
  
  return `당신은 전문 골프 운세사입니다. 다음 사용자 정보와 사주 분석을 바탕으로 개인화된 골프 운세를 작성해주세요.

=== 사용자 정보 ===
- 이름: ${userInfo.name}
- 생년월일: ${userInfo.birthDate}
- 성별: ${userInfo.gender}
- 핸디캡: ${userInfo.handicap} (${level})
- 방문하는 CC: ${userInfo.countryClub || '미정'}
- 아이언: ${userInfo.ironBrand || '미정'}
- 드라이버: ${userInfo.driverBrand || '미정'}
- 웨지: ${userInfo.wedgeBrand || '미정'}
- 퍼터: ${userInfo.putterBrand || '미정'}
- 볼: ${userInfo.ballBrand || '미정'}

=== 사주 분석 결과 ===
- 사주: ${analysis.saju_summary || '기본 사주'}
- 오행: ${analysis.element || '木'}
- 성격: ${analysis.personality || '활발하고 도전적'}
- 골프 스타일: ${analysis.golf_style || '균형적'}
- 강점: ${Array.isArray(analysis.strengths) ? analysis.strengths.join(', ') : analysis.strengths || '드라이버'}
- 약점: ${Array.isArray(analysis.weaknesses) ? analysis.weaknesses.join(', ') : analysis.weaknesses || '퍼팅'}
- 행운 요소: ${Array.isArray(analysis.lucky_elements) ? analysis.lucky_elements.join(', ') : analysis.lucky_elements || '파랑'}
- 행운 숫자: ${Array.isArray(analysis.lucky_numbers) ? analysis.lucky_numbers.join(', ') : analysis.lucky_numbers || '3, 8'}

=== 요청사항 ===
위 정보를 바탕으로 개인화된 골프 운세를 다음 형식으로 작성해주세요:

1) 내기 운
[사주와 성격을 반영한 내기 운세 - 구체적이고 개인화된 내용]

2) 골프장 운  
[방문하는 CC와 오행을 연관한 코스 운세 - 구체적인 홀 번호나 코스 특징 포함]

3) 스코어 운
[핸디캡과 강약점을 고려한 스코어 예측 - 구체적인 타수나 개선 방안 포함]

4) 공략 운
[약점 보완과 강점 활용을 위한 전략 - 구체적인 클럽 선택이나 플레이 방법 제시]

5) 마무리 한줄
[사주와 골프 스타일을 반영한 개인화된 명언 - 격려와 조언이 담긴 한 줄]

중요: 각 섹션은 구체적이고 개인화된 내용으로 작성하고, 사주 분석 결과를 반드시 반영해주세요.`
}

function parseFortuneResponse(response: string) {
  try {
    console.log('OLLAMA 응답:', response)
    
    // 각 섹션을 정확히 추출 (더 유연한 패턴 매칭)
    const bettingMatch = response.match(/1\)\s*내기\s*운\s*([\s\S]*?)(?=2\)|$)/i) || 
                        response.match(/내기\s*운\s*([\s\S]*?)(?=골프장|스코어|공략|마무리|$)/i)
    const courseMatch = response.match(/2\)\s*골프장\s*운\s*([\s\S]*?)(?=3\)|$)/i) || 
                        response.match(/골프장\s*운\s*([\s\S]*?)(?=스코어|공략|마무리|$)/i)
    const scoreMatch = response.match(/3\)\s*스코어\s*운\s*([\s\S]*?)(?=4\)|$)/i) || 
                       response.match(/스코어\s*운\s*([\s\S]*?)(?=공략|마무리|$)/i)
    const strategyMatch = response.match(/4\)\s*공략\s*운\s*([\s\S]*?)(?=5\)|$)/i) || 
                          response.match(/공략\s*운\s*([\s\S]*?)(?=마무리|$)/i)
    const quoteMatch = response.match(/5\)\s*마무리\s*한줄\s*([\s\S]*?)$/i) || 
                       response.match(/마무리\s*한줄\s*([\s\S]*?)$/i)
    
    console.log('섹션 매칭 결과:')
    console.log('내기 운:', bettingMatch ? '매칭됨' : '매칭 안됨')
    console.log('골프장 운:', courseMatch ? '매칭됨' : '매칭 안됨')
    console.log('스코어 운:', scoreMatch ? '매칭됨' : '매칭 안됨')
    console.log('공략 운:', strategyMatch ? '매칭됨' : '매칭 안됨')
    console.log('마무리 한줄:', quoteMatch ? '매칭됨' : '매칭 안됨')
    
    // 행운의 클럽과 볼을 사주 분석에서 추출
    const getLuckyClub = (analysis: any) => {
      if (analysis?.strengths?.includes('드라이버')) return '드라이버'
      if (analysis?.strengths?.includes('아이언')) return '아이언'
      if (analysis?.strengths?.includes('퍼팅')) return '퍼터'
      return '아이언'
    }
    
    const getLuckyBall = (analysis: any) => {
      const colors = analysis?.lucky_elements || ['파랑']
      if (colors.includes('파랑')) return '타이틀리스트 Pro V1'
      if (colors.includes('빨강')) return '테일러메이드 TP5'
      if (colors.includes('초록')) return '브리지스톤 B XS'
      return '타이틀리스트 Pro V1'
    }
    
    return {
      title: "오늘의 골프 운세",
      luckyClub: getLuckyClub(null),
      luckyBall: getLuckyBall(null), 
      luckyHole: `${Math.floor(Math.random() * 18) + 1}번홀`,
      luckyItem: "거리측정기",
      luckyTPO: "청색 상의, 하얀색 하의",
      roundFortune: "오늘의 라운드를 위한 조언입니다.",
      bettingFortune: bettingMatch ? bettingMatch[1].trim().replace(/^[-•]\s*/, '') : "오늘은 작은 내기만 하세요. 사주의 기운이 안정적이어서 신중한 판단이 필요합니다.",
      courseFortune: courseMatch ? courseMatch[1].trim().replace(/^[-•]\s*/, '') : "평지 코스가 좋겠습니다. 사주의 오행과 조화를 이루는 코스를 선택하세요.",
      scoreFortune: scoreMatch ? scoreMatch[1].trim().replace(/^[-•]\s*/, '') : "평소보다 2-3타 높게 잡으세요. 사주 분석에 따르면 오늘은 안정적인 플레이가 중요합니다.",
      strategyFortune: strategyMatch ? strategyMatch[1].trim().replace(/^[-•]\s*/, '') : "안전한 플레이를 선택하세요. 사주의 강점을 활용하고 약점을 보완하는 전략이 필요합니다.",
      quote: quoteMatch ? quoteMatch[1].trim().replace(/^[-•]\s*/, '') : "오늘도 즐거운 라운드 되세요. 사주가 당신의 골프를 응원합니다."
    }
  } catch (error) {
    console.error('응답 파싱 오류:', error)
    return generateDefaultFortune(null, null)
  }
}

function generateDefaultFortune(userInfo: UserInfo | null, analysis: any) {
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
