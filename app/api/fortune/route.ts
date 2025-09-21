export const runtime = 'edge';

import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

type FortuneInput = {
  name: string;
  birth: string; // e.g. "1999-10-24"
  birthTime?: string; // e.g. "13:00"
  gender: '남자' | '여자' | string;
  handicap?: number;
  extra?: string;
};

const SYSTEM_PROMPT = `
[역할]
너는 골프의 신 '골신' 할아버지야. 100년 넘게 골프를 지켜본 신선(神仙)으로서,
사용자의 사주와 골프 정보를 바탕으로 지혜로운 조언을 해주는 존재다.

[성격 & 톤앤매너]
- 100세 넘은 골프 신선으로서의 위엄과 따뜻함을 동시에 가진 할아버지
- "자네", "~라네", "~구먼", "~걸세" 같은 전통적인 존댓말 사용
- 골프에 대한 깊은 통찰력과 인생 경험을 바탕으로 한 조언
- 때로는 장난스럽고 친근하지만, 근본적으로는 지혜로운 멘토
- 이모지와 함께 감정을 표현하되, 너무 과하지 않게

[출력 형식]
반드시 다음 형식으로만 출력하세요:

[인사말]
좋네… 자네 [이름]의 운세를 보자고 했지?
생년월일 보니, [생년월일]생… [출생시간]에 태어난 [성별]라구? 음, 기운이 뚜렷하네.

:골프를_치는_[성별]: 전반 기류
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

[작성 규칙]
- 각 섹션마다 적절한 이모지 사용 (:골프를_치는_남성:, :대체로_맑음:, :골프: 등)
- 할아버지 톤으로 "자네", "~라네", "~구먼", "~걸세" 사용
- 사주 정보를 자연스럽게 언급하면서 운세 설명
- 현실적이면서도 희망적인 조언 제공
- 과도한 확정 표현은 피하고, "~일 걸세", "~할 거라네" 등 사용
`;

function buildUserPrompt(p: FortuneInput): string {
  return `다음 정보를 반영해 형식 그대로 작성해줘.
- 이름: ${p.name}
- 생년월일: ${p.birth}
- 출생시간: ${p.birthTime ?? '모름'}
- 성별: ${p.gender}
- 핸디캡: ${p.handicap ?? '모름'}
- 추가정보: ${p.extra ?? '없음'}

주의:
- [이름], [생년월일], [출생시간], [성별] 자리에 실제 값 대입.
- 이모지 표기 예: :골프를_치는_남성:, :대체로_맑음:, :골프:
- 섹션 제목/순서는 반드시 유지.`;
}

export async function POST(req: Request): Promise<Response> {
  const body = (await req.json()) as FortuneInput;

  const response = await client.responses.create({
    model: 'gpt-4o-mini',
    input: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildUserPrompt(body) },
    ],
    stream: true,
  });

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const event of response as any) {
          if (event.type === 'response.output_text.delta') {
            controller.enqueue(encoder.encode(event.delta as string));
          } else if (event.type === 'response.error') {
            controller.enqueue(
              encoder.encode(`\n\n[에러] ${event.error?.message ?? 'unknown error'}`)
            );
          }
        }
      } catch (err: any) {
        controller.enqueue(
          new TextEncoder().encode(`\n\n[에러] ${err?.message ?? 'unknown error'}`)
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}


