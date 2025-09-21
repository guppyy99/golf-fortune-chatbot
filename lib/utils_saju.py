import sys
from datetime import datetime
from lunar_python import Solar

GAN_TO_ELEMENT = {
    "甲": "木", "乙": "木",
    "丙": "火", "丁": "火",
    "戊": "土", "己": "土",
    "庚": "金", "辛": "金",
    "壬": "水", "癸": "水",
}

ELEMENT_TO_GOLF_STYLE = {
    "木": {
        "style": "공격적이고 도전적",
        "strengths": ["드라이버", "장타"],
        "weaknesses": ["퍼팅", "정확성"],
        "lucky_colors": ["초록", "파랑"],
        "lucky_numbers": [3, 8]
    },
    "火": {
        "style": "열정적이고 활발",
        "strengths": ["아이언", "어프로치"],
        "weaknesses": ["멘탈", "집중력"],
        "lucky_colors": ["빨강", "주황"],
        "lucky_numbers": [2, 7]
    },
    "土": {
        "style": "안정적이고 신중",
        "strengths": ["퍼팅", "정확성"],
        "weaknesses": ["장타", "공격성"],
        "lucky_colors": ["노랑", "갈색"],
        "lucky_numbers": [5, 0]
    },
    "金": {
        "style": "정확하고 완벽주의",
        "strengths": ["아이언", "샌드웨지"],
        "weaknesses": ["드라이버", "유연성"],
        "lucky_colors": ["흰색", "금색"],
        "lucky_numbers": [4, 9]
    },
    "水": {
        "style": "유연하고 적응력 좋음",
        "strengths": ["퍼팅", "그린플레이"],
        "weaknesses": ["아이언", "일관성"],
        "lucky_colors": ["검정", "파랑"],
        "lucky_numbers": [1, 6]
    }
}

def compute_wuxing(name: str, birthdate: str, birthtime: str | None = None, tz: int = 9):
    """
    birthdate: 'YYYY.MM.DD' or 'YYYY-MM-DD'
    birthtime: 'HH:MM' (없으면 정오 12:00로 계산)
    tz: 한국 기본 9
    return: {'element': '木|火|土|金|水', 'day_gan': '甲' ...}
    """
    try:
        # 날짜 형식 정규화
        if '.' in birthdate:
            y, m, d = map(int, birthdate.split("."))
        else:
            y, m, d = map(int, birthdate.split("-"))
        
        if birthtime and birthtime.lower() != "미입력":
            hh, mm = map(int, birthtime.split(":"))
        else:
            hh, mm = 12, 0

        # Solar(양력) → Lunar → EightChar(사주)
        solar = Solar.fromYmdHms(y, m, d, hh, mm, 0)
        lunar = solar.getLunar()
        ec = lunar.getEightChar()  # 八字

        # 일간(일주 천간) 기준 오행 산출
        day_gan = ec.getDayGan()          # e.g. '甲'
        element = GAN_TO_ELEMENT.get(day_gan, "木")  # fallback

        return {
            "element": element,
            "day_gan": day_gan,
            "month_gan": ec.getMonthGan(),
            "year_gan": ec.getYearGan(),
            "day_zhi": ec.getDayZhi(),
            "hour_gan": ec.getTimeGan(),
            "hour_zhi": ec.getTimeZhi(),
            "lunar_date": lunar.toString(),
            "solar_date": solar.toString(),
            "saju_summary": f"{ec.getYearGan()}{ec.getYearZhi()}년 {ec.getMonthGan()}{ec.getMonthZhi()}월 {ec.getDayGan()}{ec.getDayZhi()}일 {ec.getTimeGan()}{ec.getTimeZhi()}시"
        }
    except Exception as e:
        print(f"사주 계산 오류: {e}", file=sys.stderr)
        # 오류 시 기본값 반환
        return {
            "element": "木",
            "day_gan": "甲",
            "month_gan": "甲",
            "year_gan": "甲",
            "day_zhi": "子",
            "hour_gan": "甲",
            "hour_zhi": "子",
            "lunar_date": "계산 오류",
            "solar_date": "계산 오류",
            "saju_summary": "사주 계산 실패"
        }

def analyze_golf_personality(saju_data: dict, handicap: int, gender: str):
    """
    사주 데이터를 바탕으로 골프 성격 분석
    """
    element = saju_data["element"]
    element_info = ELEMENT_TO_GOLF_STYLE.get(element, ELEMENT_TO_GOLF_STYLE["木"])
    
    # 핸디캡에 따른 스타일 조정
    if handicap < 10:
        style_modifier = "전문가급"
    elif handicap < 20:
        style_modifier = "중급자"
    else:
        style_modifier = "초보자"
    
    # 성별에 따른 특성 추가
    gender_modifier = "남성적" if gender == "남자" else "여성적"
    
    return {
        "personality": f"{element_info['style']} ({style_modifier}, {gender_modifier})",
        "golf_style": element_info["style"],
        "strengths": element_info["strengths"],
        "weaknesses": element_info["weaknesses"],
        "lucky_elements": element_info["lucky_colors"],
        "recommendations": generate_recommendations(element, handicap, element_info),
        "saju_summary": saju_data.get("saju_summary", f"{saju_data.get('year_gan', '甲')}{saju_data.get('year_zhi', '子')}년 {saju_data.get('month_gan', '甲')}{saju_data.get('month_zhi', '子')}월 {saju_data.get('day_gan', '甲')}{saju_data.get('day_zhi', '子')}일 {saju_data.get('hour_gan', '甲')}{saju_data.get('hour_zhi', '子')}시"),
        "element_name": get_element_name(element),
        "element_description": get_element_description(element),
        "lucky_numbers": element_info["lucky_numbers"]
    }

def get_element_name(element: str) -> str:
    """오행 한글 이름 반환"""
    element_names = {
        "木": "목(木) - 나무의 기운",
        "火": "화(火) - 불의 기운", 
        "土": "토(土) - 땅의 기운",
        "金": "금(金) - 쇠의 기운",
        "水": "수(水) - 물의 기운"
    }
    return element_names.get(element, "목(木) - 나무의 기운")

def get_element_description(element: str) -> str:
    """오행 상세 설명 반환"""
    element_descriptions = {
        "木": "성장과 발전의 기운으로, 새로운 도전과 확장을 의미합니다. 골프에서는 공격적이고 도전적인 플레이를 선호합니다.",
        "火": "열정과 활력의 기운으로, 리더십과 표현력을 의미합니다. 골프에서는 열정적이고 활발한 플레이를 합니다.",
        "土": "안정과 신뢰의 기운으로, 꾸준함과 실용성을 의미합니다. 골프에서는 안정적이고 신중한 플레이를 선호합니다.",
        "金": "정의와 완성의 기운으로, 정확성과 완벽을 의미합니다. 골프에서는 정교하고 완벽주의적인 플레이를 합니다.",
        "水": "지혜와 적응의 기운으로, 유연성과 지혜를 의미합니다. 골프에서는 유연하고 적응력이 뛰어난 플레이를 합니다."
    }
    return element_descriptions.get(element, "성장과 발전의 기운으로, 새로운 도전과 확장을 의미합니다.")

def generate_recommendations(element: str, handicap: int, element_info: dict):
    """
    오행과 핸디캡에 따른 골프 추천사항
    """
    base_recommendations = [
        "충분한 워밍업을 하세요",
        "긍정적인 마음가짐을 유지하세요",
        "집중력을 높이세요"
    ]
    
    element_recommendations = {
        "木": ["드라이버 연습에 집중하세요", "공격적인 플레이를 시도해보세요"],
        "火": ["아이언 샷 연습을 많이 하세요", "열정적으로 플레이하세요"],
        "土": ["퍼팅 연습에 시간을 투자하세요", "안정적인 플레이를 하세요"],
        "金": ["정확성을 중시하는 연습을 하세요", "완벽을 추구하되 스트레스는 피하세요"],
        "水": ["그린 위에서의 플레이를 연습하세요", "유연한 사고로 플레이하세요"]
    }
    
    handicap_recommendations = []
    if handicap >= 20:
        handicap_recommendations = ["기본기 연습에 집중하세요", "단계별로 실력을 향상시키세요"]
    elif handicap >= 10:
        handicap_recommendations = ["특정 클럽의 정확도를 높이세요", "멘탈 게임을 연습하세요"]
    else:
        handicap_recommendations = ["고급 기술을 연습하세요", "경기 전략을 연구하세요"]
    
    return base_recommendations + element_recommendations.get(element, []) + handicap_recommendations

def create_fortune_prompt(user_info: dict, saju_analysis: dict):
    """
    사주 분석 결과를 바탕으로 OLLAMA 프롬프트 생성
    """
    return f"""
당신은 전문 골프 운세사입니다. 다음 사용자 정보와 사주 분석을 바탕으로 골프 운세를 작성해주세요.

=== 사용자 정보 ===
- 이름: {user_info['name']}
- 생년월일: {user_info['birthDate']}
- 성별: {user_info['gender']}
- 핸디캡: {user_info['handicap']}
- 자주 가는 골프장: {user_info['countryClub']}

=== 사주 분석 결과 ===
- 사주: {saju_analysis['saju_summary']}
- 오행: {saju_analysis['element']}
- 성격: {saju_analysis['personality']}
- 골프 스타일: {saju_analysis['golf_style']}
- 강점: {', '.join(saju_analysis['strengths'])}
- 약점: {', '.join(saju_analysis['weaknesses'])}
- 행운 요소: {saju_analysis['lucky_elements']}
- 추천사항: {', '.join(saju_analysis['recommendations'])}

=== 요청사항 ===
위 정보를 바탕으로 개인화된 골프 운세를 다음 JSON 형식으로 작성해주세요:

{{
  "title": "운세 제목 (사주와 골프 스타일을 반영)",
  "luckyClub": "행운의 클럽 (강점과 오행을 고려)",
  "luckyBall": "행운의 볼 (오행 색상 고려)",
  "luckyHole": "행운의 홀 (사주와 관련)",
  "luckyTPO": "행운의 복장 (행운 색상 포함)",
  "roundFortune": "나의 전반적 기류 (올해 전체적인 골프 운세와 기류)",
  "bettingFortune": "멘탈 운 (골프 플레이 시 정신적 상태와 멘탈 관리)",
  "strategyFortune": "기술 운 (스윙, 샷 기술, 클럽 사용 등 기술적 측면)",
  "scoreFortune": "체력 운 (신체 컨디션, 지구력, 건강 상태 등)",
  "courseFortune": "대인 & 인맥 운 (골프 파트너, 동반자, 골프장 관계자 등)",
  "quote": "종합 메시지 (개인화된 마무리 메시지)"
}}

중요: 반드시 JSON 형식으로만 응답하고, 다른 설명은 포함하지 마세요.
"""
