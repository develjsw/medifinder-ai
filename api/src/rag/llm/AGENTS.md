<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-31 | Updated: 2026-03-31 -->

# api/src/rag/llm

## Purpose
GPT-4o-mini 기반 LLM 답변 생성. 시스템 프롬프트와 사용자 메시지 템플릿을 받아 LangChain 체인으로 실행하고 텍스트 답변을 반환한다.

## Key Files

| File | Description |
|------|-------------|
| `llm.service.ts` | `generateAnswer()` — ChatPromptTemplate + ChatOpenAI + StringOutputParser 체인 실행 |
| `llm.module.ts` | LlmService 등록 및 exports |

## For AI Agents

### Working In This Directory
- **모델**: `gpt-4o-mini`, temperature=0 (일관된 답변)
- `generateAnswer(systemPrompt, humanMessage, variables)`: 변수 보간을 지원하는 템플릿 기반 — `{context}`, `{query}` 등
- 프롬프트 내용은 `hospital/constant/prompt.constant.ts`에서 관리 — 이 서비스는 실행만 담당

### Common Patterns
- LangChain LCEL(LangChain Expression Language) 파이프라인: `ChatPromptTemplate.pipe(ChatOpenAI).pipe(StringOutputParser)`

## Dependencies

### External
- `@langchain/openai` — ChatOpenAI
- `@langchain/core/prompts` — ChatPromptTemplate
- `@langchain/core/output_parsers` — StringOutputParser

<!-- MANUAL: -->
