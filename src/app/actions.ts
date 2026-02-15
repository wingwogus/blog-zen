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
      // 실제 환경에서는 CORS 및 스크래핑 방지 정책으로 인해 서버 사이드 페칭 필요
      const response = await fetch(blogUrl, { next: { revalidate: 3600 } });
      const html = await response.text();
      // 간단한 메타 데이터 및 텍스트 추출 (현실적으로는 JSDOM 등을 활용하지만, 여기서는 핵심 텍스트 위주)
      blogContext = html.substring(0, 2000).replace(/<[^>]*>?/gm, ''); 
    } catch (e) {
      console.warn('Blog URL analysis failed, proceeding with general style.');
    }
  }

  // 2. Gemini SDK 초기화
  const genAI = new GoogleGenerativeAI(userApiKey);
  // 가장 똑똑한 모델인 gemini-1.5-pro 사용
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const systemPrompt = `
당신은 세계 최고의 블로그 콘텐츠 전략가이자 전문 작가입니다. 
다음 정보를 바탕으로 독창적이고 매력적인 블로그 초안을 마크다운 형식으로 작성하십시오.

[입력 정보]
- 주제: "${topic}"
- 참고 블로그 URL: ${blogUrl || '제공되지 않음'}
- 블로그 스타일 컨텍스트: ${blogContext ? '아래 제공되는 텍스트의 톤앤매너, 문체, 단어 선택을 분석하여 완벽하게 반영하십시오.' : '전문적이고 신뢰감 있는 문체'}

[분석할 블로그 텍스트 데이터]
${blogContext}

[작성 가이드라인]
1. 형식: GitHub Flavored Markdown을 준수하십시오.
2. 구조: 
   - [H1] 독자의 시선을 사로잡는 강력한 제목
   - [인용구] 글의 핵심 메시지 요약
   - [H2] 흥미로운 서론 (최신 트렌드나 통계 활용)
   - [H2/H3] 본문 (3개 이상의 심층 섹션, 리스트와 볼트체 적절히 사용)
   - [H2] 결론 (독자의 행동을 촉구하는 문구 포함)
   - [구분선] 이후 SEO용 태그 및 요약 정보
3. 언어: 한국어 (매끄럽고 세련된 문장 구사)
4. 주의사항: 절대 AI가 쓴 것처럼 보이지 않게 인간적인 통찰을 담으십시오.
  `;

  try {
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text) throw new Error('AI가 응답을 생성하지 못했습니다.');
    
    return text;

  } catch (error: any) {
    console.error('Gemini API Error:', error);
    if (error.message?.includes('API_KEY_INVALID')) {
      throw new Error('유효하지 않은 API Key입니다. 설정을 확인해주세요.');
    }
    throw new Error('AI 생성 도중 오류가 발생했습니다. (Gemini Pro 엔진)');
  }
}
