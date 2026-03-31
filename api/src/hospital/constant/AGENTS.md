<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-31 | Updated: 2026-03-31 -->

# api/src/hospital/constant

## Purpose
검색 파이프라인 튜닝 파라미터와 LLM 프롬프트 상수를 중앙 관리한다. 검색 품질 조정 시 이 디렉토리의 상수만 수정하면 파이프라인 전체에 반영된다.

## Key Files

| File | Description |
|------|-------------|
| `search.constant.ts` | 검색 파라미터 상수 — RRF_K(60), TOP_K(10), RERANK_CANDIDATES(10), FINAL_K(5), SCORE_THRESHOLD(0.33), RERANK_SCORE_THRESHOLD(0.6) |
| `prompt.constant.ts` | LLM 시스템 프롬프트(`SYSTEM_PROMPT`) 및 사용자 메시지 템플릿(`HUMAN_MESSAGE`) |

## For AI Agents

### Working In This Directory
- **검색 품질 튜닝 시 이 파일을 먼저 수정**: 임계값을 하드코딩하지 말 것
- `SCORE_THRESHOLD`: 벡터 유사도 임계값 (0~1, cosine similarity) — 높일수록 정확하지만 결과 감소
- `RERANK_SCORE_THRESHOLD`: Cohere rerank 관련성 임계값 — 실제 데이터로 테스트하며 조절 필요
- `TOP_K`: 키워드/벡터 각각의 후보 수, `FINAL_K`: 최종 반환 병원 수
- `RRF_K=60`: 표준 RRF 상수 — 일반적으로 수정 불필요

<!-- MANUAL: -->
