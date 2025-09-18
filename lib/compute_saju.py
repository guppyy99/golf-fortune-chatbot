#!/usr/bin/env python3
import sys
import json
from utils_saju import compute_wuxing, analyze_golf_personality

def main():
    try:
        # stdin에서 사용자 정보 읽기
        input_data = sys.stdin.read()
        user_info = json.loads(input_data)
        
        # 사주 계산
        saju_data = compute_wuxing(
            name=user_info['name'],
            birthdate=user_info['birthDate'],
            birthtime=user_info['birthTime'],
            tz=9
        )
        
        # 골프 성격 분석
        golf_analysis = analyze_golf_personality(
            saju_data=saju_data,
            handicap=user_info['handicap'],
            gender=user_info['gender']
        )
        
        # 결과 합치기
        result = {
            **saju_data,
            **golf_analysis
        }
        
        # JSON으로 출력
        print(json.dumps(result, ensure_ascii=False))
        
    except Exception as e:
        print(f"사주 계산 오류: {e}", file=sys.stderr)
        # 오류 시 기본값 반환
        error_result = {
            "element": "木",
            "day_gan": "甲",
            "month_gan": "甲",
            "year_gan": "甲",
            "day_zhi": "子",
            "hour_gan": "甲",
            "hour_zhi": "子",
            "lunar_date": "오류",
            "solar_date": "오류",
            "personality": "활발하고 도전적",
            "golf_style": "균형적",
            "strengths": ["드라이버"],
            "weaknesses": ["퍼팅"],
            "lucky_elements": [["파랑"], [1, 6]],
            "recommendations": ["충분한 워밍업을 하세요"],
            "saju_summary": "사주 계산 실패"
        }
        print(json.dumps(error_result, ensure_ascii=False))

if __name__ == "__main__":
    main()
