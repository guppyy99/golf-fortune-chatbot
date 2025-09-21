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
        "lucky_numbers": [3, 8],
        "lucky_clubs": {
            "primary": "드라이버",
            "secondary": "아이언",
            "description": "강력한 드라이버로 페어웨이를 정복하는 클럽"
        },
        "lucky_balls": {
            "primary": "초록색 볼",
            "secondary": "파란색 볼", 
            "description": "자연의 기운을 담은 색상의 볼"
        },
        "lucky_tpo": {
            "primary": "초록색 골프웨어",
            "secondary": "파란색 골프웨어",
            "description": "자연과 조화를 이루는 색상의 복장"
        }
    },
    "火": {
        "style": "열정적이고 활발",
        "strengths": ["아이언", "어프로치"],
        "weaknesses": ["멘탈", "집중력"],
        "lucky_colors": ["빨강", "주황"],
        "lucky_numbers": [2, 7],
        "lucky_clubs": {
            "primary": "아이언",
            "secondary": "웨지",
            "description": "정확한 아이언으로 핀을 노리는 클럽"
        },
        "lucky_balls": {
            "primary": "빨간색 볼",
            "secondary": "주황색 볼",
            "description": "열정을 불러일으키는 색상의 볼"
        },
        "lucky_tpo": {
            "primary": "빨간색 골프웨어",
            "secondary": "주황색 골프웨어", 
            "description": "활력과 열정을 보여주는 색상의 복장"
        }
    },
    "土": {
        "style": "안정적이고 신중",
        "strengths": ["퍼팅", "정확성"],
        "weaknesses": ["장타", "공격성"],
        "lucky_colors": ["노랑", "갈색"],
        "lucky_numbers": [5, 0],
        "lucky_clubs": {
            "primary": "퍼터",
            "secondary": "웨지",
            "description": "안정적인 퍼터로 그린을 정복하는 클럽"
        },
        "lucky_balls": {
            "primary": "노란색 볼",
            "secondary": "갈색 볼",
            "description": "안정감을 주는 색상의 볼"
        },
        "lucky_tpo": {
            "primary": "노란색 골프웨어",
            "secondary": "갈색 골프웨어",
            "description": "신뢰감을 주는 색상의 복장"
        }
    },
    "金": {
        "style": "정확하고 완벽주의",
        "strengths": ["아이언", "샌드웨지"],
        "weaknesses": ["드라이버", "유연성"],
        "lucky_colors": ["흰색", "금색"],
        "lucky_numbers": [4, 9],
        "lucky_clubs": {
            "primary": "샌드웨지",
            "secondary": "아이언",
            "description": "정밀한 샌드웨지로 정확성을 높이는 클럽"
        },
        "lucky_balls": {
            "primary": "흰색 볼",
            "secondary": "금색 볼",
            "description": "순수함과 완벽함을 상징하는 색상의 볼"
        },
        "lucky_tpo": {
            "primary": "흰색 골프웨어",
            "secondary": "금색 골프웨어",
            "description": "깔끔하고 세련된 색상의 복장"
        }
    },
    "水": {
        "style": "유연하고 적응력 좋음",
        "strengths": ["퍼팅", "그린플레이"],
        "weaknesses": ["아이언", "일관성"],
        "lucky_colors": ["검정", "파랑"],
        "lucky_numbers": [1, 6],
        "lucky_clubs": {
            "primary": "퍼터",
            "secondary": "드라이버",
            "description": "유연한 퍼터로 그린 위에서 승부하는 클럽"
        },
        "lucky_balls": {
            "primary": "검은색 볼",
            "secondary": "파란색 볼",
            "description": "차분함과 집중력을 주는 색상의 볼"
        },
        "lucky_tpo": {
            "primary": "검은색 골프웨어",
            "secondary": "파란색 골프웨어",
            "description": "차분하고 우아한 색상의 복장"
        }
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
        "lucky_numbers": element_info["lucky_numbers"],
        "lucky_club": element_info["lucky_clubs"]["primary"],
        "lucky_ball": element_info["lucky_balls"]["primary"],
        "lucky_tpo": element_info["lucky_tpo"]["primary"]
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
    사주 분석 결과를 바탕으로 골신 할아버지 스타일 프롬프트 생성
    """
    return f"""
당신은 골프의 신 '골신' 할아버지입니다. 100년 넘게 골프를 지켜본 신선으로서, 사용자의 운세를 봐주세요.

=== 사용자 정보 ===
- 이름: {user_info['name']}
- 생년월일: {user_info['birthDate']}
- 성별: {user_info['gender']}
- 핸디캡: {user_info['handicap']}
- 방문 예정 CC: {user_info.get('countryClub', '미정')}

=== 사주 분석 결과 ===
- 사주: {saju_analysis['saju_summary']}
- 오행: {saju_analysis['element']} ({saju_analysis['element_name']})
- 성격: {saju_analysis['personality']}
- 골프 스타일: {saju_analysis['golf_style']}
- 강점: {', '.join(saju_analysis['strengths'])}
- 약점: {', '.join(saju_analysis['weaknesses'])}
- 행운 요소: {saju_analysis['lucky_elements']}
- 행운의 클럽: {saju_analysis['lucky_club']}
- 행운의 볼: {saju_analysis['lucky_ball']}
- 행운의 TPO: {saju_analysis['lucky_tpo']}

=== 요청사항 ===
골신 할아버지 톤으로 다음 형식에 맞춰 운세를 작성해주세요:

[인사말]
좋네… 자네 {user_info['name']}의 운세를 보자고 했지?
생년월일 보니, {user_info['birthDate']}생… {user_info.get('birthTime', '낮')}에 태어난 {user_info['gender']}라구? 음, 기운이 뚜렷하네.

:골프를_치는_{user_info['gender']}: 전반 기류
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
- 이모지는 적절히 사용하되 과하지 않게
"""
