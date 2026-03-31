<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-31 | Updated: 2026-03-31 -->

# api/src/rag

## Purpose
RAG 인프라 통합 모듈. 임베딩(Pinecone 벡터 검색), LLM(GPT-4o-mini 답변 생성), Re-Ranking(Cohere 재정렬) 세 가지 AI 인프라 서비스를 하나의 모듈로 묶어 `HospitalModule`에 제공한다.

## Key Files

| File | Description |
|------|-------------|
| `rag.module.ts` | EmbeddingModule, LlmModule, RerankModule을 임포트하고 모두 exports로 재노출 |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `embedding/` | Pinecone 벡터 스토어 연동 및 유사도 검색 (see `embedding/AGENTS.md`) |
| `llm/` | GPT-4o-mini 기반 답변 생성 (see `llm/AGENTS.md`) |
| `rerank/` | Cohere Cross-Encoder 기반 문서 재정렬 (see `rerank/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- `RagModule`은 집합 모듈(Aggregation Module) 패턴 — 직접 로직 없이 하위 모듈을 묶어 재노출
- 새 AI 인프라 서비스 추가 시: 하위 모듈 생성 → `rag.module.ts`의 `imports`와 `exports`에 추가
- `HospitalModule`은 `RagModule`만 임포트하면 세 서비스 모두 사용 가능

### Common Patterns
- 각 하위 모듈은 독립적으로 동작 가능한 완결 구조 (단일 서비스 + 단일 모듈)

## Dependencies

### External
- `@langchain/openai` — OpenAI 임베딩 및 LLM
- `@langchain/pinecone` — Pinecone 벡터 스토어
- `@langchain/cohere` — Cohere Re-Ranking

<!-- MANUAL: -->
