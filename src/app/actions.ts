'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * 🚀 Blog Zen - Real AI Synthesis Engine (Gemini 2.0 Flash)
 */
export async function generateBlogDraft(topic: string, userApiKey: string, blogUrl?: string) {
  if (!userApiKey) {
    throw new Error('API Key가 누락되었습니다. 설정에서 등록해주세요.');
  }

  // 1. 블로그 데이터 수집 (스마트 파싱)
  let blogContext = "";
  if (blogUrl) {
    try {
      const response = await fetch(blogUrl, { 
        next: { revalidate: 3600 },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      if (!response.ok) throw new Error('Blog fetch failed');
      const html = await response.text();
      blogContext = html
        .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gm, "")
        .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gm, "")
        .replace(/<[^>]*>?/gm, ' ')
        .replace(/\s+/g, ' ')
        .substring(0, 30000);
    } catch (e) {
      console.warn('Blog URL analysis failed.', e);
      blogContext = "분석 실패: URL에 접근할 수 없습니다.";
    }
  }

  // 2. Gemini SDK 초기화
  const genAI = new GoogleGenerativeAI(userApiKey);
  // [BACKEND UPDATE] 모델 버전 변경: 사용자 요청에 따라 2.0 Flash 사용
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // [PROMENG UPDATE] 분석 리포트 + 본문 생성 프롬프트
  const systemPrompt = `
당신은 'Blog Zen'의 수석 에디터입니다.
사용자 블로그(${blogUrl})의 스타일을 정밀 분석하고, 그 분석 결과를 먼저 보고한 뒤, 해당 스타일을 적용하여 글을 작성하십시오.

[입력 정보]
- 주제: "${topic}"
- 참고 텍스트: 
"""
${blogContext}
"""

[출력 형식 가이드]
반드시 아래 두 파트로 나누어 출력하십시오.

---
### 🕵️‍♂️ 블로그 스타일 분석 리포트
**1. 톤앤매너 (Tone & Manner)**:
- (분석 내용: 예 - "친근하고 구어체를 많이 사용하는 '해요체' 중심입니다.")
**2. 구조적 특징 (Layout)**:
- (분석 내용: 예 - "소제목을 이모지와 함께 사용하며, 문단 사이 간격이 넓습니다.")
**3. 주요 키워드 패턴**:
- (분석 내용: 자주 사용되는 어휘나 표현)

> **"분석된 위 스타일을 100% 반영하여 아래 초안을 작성했습니다."**
---

# (여기서부터 블로그 본문 시작: 분석된 스타일 적용)
(GitHub Flavored Markdown 형식으로 작성)
...
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
      throw new Error('API Key가 유효하지 않습니다.');
    }
    throw new Error(`AI 생성 오류: ${error.message}`);
  }
}
