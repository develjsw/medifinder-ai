<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-31 | Updated: 2026-03-31 -->

# api/src/rag/embedding

## Purpose
Pinecone 벡터 스토어 연동 및 유사도 검색. `onModuleInit()`에서 OpenAI 임베딩 모델과 Pinecone 인덱스에 연결하고, 쿼리를 임베딩하여 가장 유사한 병원 문서를 점수와 함께 반환한다.

## Key Files

| File | Description |
|------|-------------|
| `embedding.service.ts` | Pinecone 연결 초기화 및 `similaritySearchWithScore()` 제공 |
| `embedding.module.ts` | EmbeddingService 등록 및 exports |

## For AI Agents

### Working In This Directory
- **임베딩 모델**: `text-embedding-3-small`, dimensions=**1024** (기본 1536이지만 Pinecone 무료 인덱스 제약으로 축소)
- Pinecone 인덱스 dimensions도 반드시 1024로 설정되어 있어야 함
- `similaritySearchWithScore()` 반환값: `[Document<HospitalMetadata>, cosineScore][]`
- 반환된 점수는 `HybridRetrieverService`에서 `SCORE_THRESHOLD`로 필터링

### Common Patterns
- `OnModuleInit` 인터페이스 구현 — 앱 시작 시 자동으로 Pinecone 연결
- `PineconeStore.fromExistingIndex()`: 기존 인덱스에 연결 (새 인덱스 생성 아님)

## Dependencies

### External
- `@langchain/pinecone` — PineconeStore
- `@langchain/openai` — OpenAIEmbeddings
- `@pinecone-database/pinecone` — Pinecone 클라이언트

<!-- MANUAL: -->
