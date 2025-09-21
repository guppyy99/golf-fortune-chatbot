// 로컬 OLLAMA로 운세 생성하는 스크립트
const fs = require('fs');
const path = require('path');

// 샘플 사용자 데이터
const sampleUsers = [
  {
    name: "김골프",
    birthDate: "1990-05-15",
    gender: "남성",
    handicap: 15,
    phone: "010-1234-5678"
  },
  {
    name: "이파",
    birthDate: "1985-08-22",
    gender: "여성", 
    handicap: 8,
    phone: "010-9876-5432"
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
        prompt: `당신은 골프의 신 '골신' 할아버지입니다. ${userInfo.name}님(${userInfo.birthDate}생, ${userInfo.gender}, 핸디캡 ${userInfo.handicap})의 골프 운세를 봐주세요.`,
        stream: false,
        options: {
          temperature: 0.8,
          top_p: 0.9,
          max_tokens: 1500
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
}

generateAllFortunes();
