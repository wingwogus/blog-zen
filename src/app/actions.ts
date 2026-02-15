'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * 🚀 Blog Zen - Real AI Synthesis Engine (Gemini Pro)
 */
export async function generateBlogDraft(topic: string, userApiKey: string, blogUrl?: string) {
  if (!userApiKey) {
    throw new Error('API Key가 누락되었습니다. 설정에서 등록해주세요.');
  }

  // 1. 블로그 분석 시뮬레이션 및 데이터 수집
  let blogContext = "";
  if (blogUrl) {
    try {
      // [BACKEND UPDATE] 서버 사이드 페칭 강화
      const response = await fetch(blogUrl, { 
        next: { revalidate: 3600 },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (!response.ok) throw new Error('Blog fetch failed');
      
      const html = await response.text();
      
      // [BACKEND UPDATE] 스마트 컨텍스트 추출
      // 단순 2000자가 아닌, 본문일 가능성이 높은 영역을 확보하기 위해 범위를 대폭 늘리고
      // 불필요한 공백과 스크립트를 제거하여 '의미 있는 텍스트' 밀도를 높임
      blogContext = html
        .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gm, "") // 스크립트 제거
        .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gm, "")   // 스타일 제거
        .replace(/<[^>]*>?/gm, ' ')                           // 태그 제거
        .replace(/\s+/g, ' ')                                 // 공백 축소
        .substring(0, 30000);                                 // Flash 모델의 긴 컨텍스트 활용 (30k chars)
        
    } catch (e) {
      console.warn('Blog URL analysis failed, proceeding with general style.', e);
      blogContext = "블로그 접속 불가 또는 분석 실패. 일반적인 전문 블로그 스타일을 적용합니다.";
    }
  }

  // 2. Gemini SDK 초기화
  const genAI = new GoogleGenerativeAI(userApiKey);
  // [BACKEND CONFIRM] gemini-3-flash 엔진 사용
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash" });

  // [PROMENG UPDATE] 프롬프트 고도화: 스타일 분석 지침 강화
  const systemPrompt = `
당신은 'Blog Zen' 서비스의 수석 콘텐츠 에디터입니다.
사용자의 요구사항과 기존 블로그 스타일을 완벽하게 동기화하여, 수정 없이 즉시 발행 가능한 수준의 초안을 작성하십시오.

[핵심 미션]
1. **Style Cloning**: 제공된 [참고 텍스트]에서 어조(Tone), 문장 길이, 자주 쓰는 어휘, 문단 구성 방식을 분석하여 작성 스타일에 그대로 반영하십시오.
   - 예: 딱딱한 문체 vs 친근한 해요체, 이모지 사용 여부, 소제목 활용 패턴 등.
2. **Value First**: 단순 정보 나열이 아닌, 독자에게 '통찰(Insight)'과 '실용적 가치'를 주는 글을 쓰십시오.

[입력 정보]
- 주제: "${topic}"
- 참고 URL: ${blogUrl || '없음'}

[참고 텍스트 (사용자 블로그 데이터)]
"""
${blogContext}
"""

[출력 가이드라인]
- 포맷: GitHub Flavored Markdown (가독성 최적화)
- 구조:
  1. **헤드라인**: 클릭을 유도하는 매력적인 제목 (H1)
  2. **오프닝**: 독자의 공감을 이끌어내는 도입부 (3문장 이내)
  3. **본문**: 3~4개의 핵심 소주제 (H2)와 구체적인 설명. 불렛 포인트 활용 적극 권장.
  4. **클로징**: 여운을 남기거나 행동을 유도하는 결론
  5. **SEO 태그**: 글의 하단에 관련 해시태그 5개 이상 배치
- 언어: 한국어 (Natural Korean)

지금 바로 작성을 시작하십시오.
  `;

  try {
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text) throw new Error('AI 응답 생성 실패');
    
    return text;

  } catch (error: any) {
    console.error('Gemini API Error:', error);
    if (error.message?.includes('API_KEY_INVALID')) {
      throw new Error('API Key가 유효하지 않습니다. 설정을 확인해주세요.');
    }
    throw new Error(`AI 생성 오류: ${error.message}`);
  }
}
