<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-31 | Updated: 2026-03-31 -->

# api/src/rag/rerank

## Purpose
Cohere Cross-Encoder 기반 문서 재정렬. Hybrid Search로 확보한 후보 문서들을 질문과의 실제 관련성 기준으로 재정렬하고, 관련성 점수 임계값(`RERANK_SCORE_THRESHOLD`) 미만 문서를 제거한다.

## Key Files

| File | Description |
|------|-------------|
| `rerank.service.ts` | `rerank(query, docs, topN, scoreThreshold)` — Cohere rerank-v3.5로 문서 재정렬 및 필터링 |
| `rerank.module.ts` | RerankService 등록 및 exports |

## For AI Agents

### Working In This Directory
- **모델**: `rerank-v3.5` (Cohere 최신 재정렬 모델)
- 입력: 질문 + 문서 목록 → 출력: 관련성 점수 기준 재정렬된 상위 N개 문서
- `scoreThreshold` 미만 문서는 결과에서 제외 — 현재 기본값 0.6 (`search.constant.ts`)
- 빈 문서 배열 입력 시 조기 반환 (`[]`)

### Common Patterns
- 제네릭 타입 `<T extends Record<string, any>>` — 다양한 메타데이터 타입 지원

## Dependencies

### External
- `@langchain/cohere` — CohereRerank

<!-- MANUAL: -->
