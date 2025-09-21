// 로컬 OLLAMA로 운세 생성하는 스크립트
const fs = require('fs');
const path = require('path');

// 샘플 사용자 데이터 (다양한 케이스)
const sampleUsers = [
  {
    name: "김골프",
    birthDate: "1990-05-15",
    gender: "남성",
    handicap: 15,
    phone: "010-1234-5678",
    birthTime: "아침"
  },
  {
    name: "이파",
    birthDate: "1985-08-22",
    gender: "여성", 
    handicap: 8,
    phone: "010-9876-5432",
    birthTime: "오후"
  },
  {
    name: "박드라이버",
    birthDate: "1995-03-10",
    gender: "남성",
    handicap: 25,
    phone: "010-5555-1234",
    birthTime: "새벽"
  },
  {
    name: "최퍼팅",
    birthDate: "1988-12-05",
    gender: "여성",
    handicap: 5,
    phone: "010-7777-8888",
    birthTime: "저녁"
  },
  {
    name: "정아이언",
    birthDate: "1992-07-20",
    gender: "남성",
    handicap: 12,
    phone: "010-3333-4444",
    birthTime: "아침"
  }
];

async function generateFortuneWithOllama(userInfo) {
  try {
    console.log(`${userInfo.name}님의 운세 생성 중...`);
    
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-oss:20b',
        prompt: `당신은 골프의 신 '골신' 할아버지입니다. 100년 넘게 골프를 지켜본 신선으로서, 사용자의 운세를 봐주세요.

=== 사용자 정보 ===
- 이름: ${userInfo.name}
- 생년월일: ${userInfo.birthDate}
- 성별: ${userInfo.gender}
- 핸디캡: ${userInfo.handicap}

반드시 다음 형식으로만 출력하세요:

[인사말]
좋네… 자네 ${userInfo.name}의 운세를 보자고 했지?
생년월일 보니, ${userInfo.birthDate}생… ${userInfo.gender}라구? 음, 기운이 뚜렷하네.

:골프를_치는_${userInfo.gender === '남성' ? '남성' : '여성'}: 전반 기류
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
허허, 그러니 너무 조급해 말고… [간단한 조언 한 문장]`,
        stream: false,
        options: {
          temperature: 0.8,
          top_p: 0.9,
          num_predict: 1500
        }
      })
    });

    if (!response.ok) {
      throw new Error(`OLLAMA API 오류: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('OLLAMA 운세 생성 오류:', error);
    return null;
  }
}

async function generateAllFortunes() {
  const fortunes = {};
  
  for (const user of sampleUsers) {
    const fortune = await generateFortuneWithOllama(user);
    if (fortune) {
      fortunes[user.name] = {
        userInfo: user,
        fortune: fortune
      };
    }
  }
  
  // fortunes.json 파일로 저장
  const outputPath = path.join(__dirname, '../public/fortunes.json');
  fs.writeFileSync(outputPath, JSON.stringify(fortunes, null, 2), 'utf8');
  
  console.log('모든 운세가 public/fortunes.json에 저장되었습니다!');
  console.log('이제 Vercel에 배포하면 정적 데이터로 사용할 수 있습니다.');
  console.log('');
  console.log('=== 사용법 ===');
  console.log('1. OLLAMA 서버 실행: ollama serve');
  console.log('2. 모델 다운로드: ollama pull gpt-oss:20b');
  console.log('3. 운세 생성: npm run generate-fortunes');
  console.log('4. Vercel 배포: git push');
  console.log('');
  console.log('생성된 운세 개수:', Object.keys(fortunes).length);
}

generateAllFortunes();
