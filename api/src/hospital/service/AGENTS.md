<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-31 | Updated: 2026-03-31 -->

# api/src/hospital/service

## Purpose
병원 도메인의 비즈니스 서비스 레이어. SRP에 따라 세 가지 서비스로 분리된다: 검색 파이프라인 오케스트레이션, 하이브리드 검색 실행, 기본 CRUD.

## Key Files

| File | Description |
|------|-------------|
| `hospital-search.service.ts` | 검색 오케스트레이터 — Hybrid Search → Re-Ranking → LLM 답변 생성 흐름 조율 |
| `hybrid-retriever.service.ts` | 하이브리드 검색기 — 키워드(SQL LIKE) + 벡터(Pinecone) 병렬 검색 → Score Filtering → RRF 합산 |
| `hospital.service.ts` | 기본 CRUD 서비스 — `findAll()`, `findOne(id)` |

## For AI Agents

### Working In This Directory
- **검색 흐름**: `HospitalSearchService.search()` → `HybridRetrieverService.retrieve()` → `RerankService.rerank()` → `LlmService.generateAnswer()`
- **RRF 구현**: `HybridRetrieverService.rrfFusion()` — 병원명(`metadata.name`)을 키로 사용, 양쪽 결과 점수 합산 후 `RERANK_CANDIDATES` 수만큼 반환
- Re-Ranking 후 결과가 없으면 `{ answer: '', sources: [] }` 조기 반환
- 각 서비스는 단일 책임 — 오케스트레이션 로직을 `hybrid-retriever.service.ts`에 혼재시키지 말 것

### Common Patterns
- 키워드/벡터 검색은 `Promise.all()`로 동시 실행 (레이턴시 최적화)
- RRF 점수: `1 / (RRF_K + rank + 1)` — rank는 0-based index

## Dependencies

### Internal
- `hospital.repository.ts` — 키워드 검색
- `hospital-document.mapper.ts` — 데이터 변환

### External
- `src/rag/embedding/` — 벡터 유사도 검색
- `src/rag/rerank/` — Cohere Re-Ranking
- `src/rag/llm/` — GPT-4o-mini 답변 생성

<!-- MANUAL: -->
