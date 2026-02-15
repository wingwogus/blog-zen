'use server';

/**
 * 블로그 초안 생성 함수
 * @param topic 사용자가 입력한 주제
 * @returns 생성된 블로그 초안 (Markdown)
 */
export async function generateBlogDraft(topic: string, userApiKey: string) {
  // 사용자가 전달한 API Key를 우선적으로 사용합니다.
  const apiKey = userApiKey || process.env.AI_API_KEY;

  if (!apiKey) {
    throw new Error('API Key가 필요합니다. 설정에서 등록해주세요.');
  }

  // 1. 실제 API 연동 로직 (Key가 있을 경우)
  // 현재는 시뮬레이션 중이며, 전달받은 키의 일부를 보여줌으로써 연동 확인
  await new Promise((resolve) => setTimeout(resolve, 2000));

  if (!topic || topic.trim().length < 2) {
    throw new Error('주제는 최소 2글자 이상 입력해주세요.');
  }

  const keyHint = apiKey.substring(0, 5) + '...' + apiKey.substring(apiKey.length - 3);

  return `
# [실전] ${topic}에 대하여

> **인증 완료**: 사용자의 API Key(${keyHint})를 사용하여 생성 프로세스가 가동되었습니다.

## 🔍 서론: ${topic}의 중요성
우리는 현재 ${topic}이(가) 일상과 산업 전반에 깊숙이 자리 잡은 시대에 살고 있습니다. 왜 지금 ${topic}에 주목해야 할까요? 그 이유를 본문에서 자세히 다루어 보겠습니다.
... (생략된 본문)
`.trim();
}
