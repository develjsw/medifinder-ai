<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-31 | Updated: 2026-03-31 -->

# api/src/hospital

## Purpose
병원 도메인의 핵심 모듈. HTTP 엔드포인트 노출부터 RAG 파이프라인 실행까지 병원 검색의 모든 비즈니스 로직을 담당한다. Hybrid Search(키워드 + 벡터) → RRF → Re-Ranking → LLM 답변 생성의 전체 흐름이 이 모듈에서 조율된다.

## Key Files

| File | Description |
|------|-------------|
| `hospital.controller.ts` | HTTP 엔드포인트 — `GET /hospitals`, `GET /hospitals/:id`, `POST /hospitals/search` |
| `hospital.module.ts` | 모듈 구성 — PrismaModule, RagModule 임포트, 내부 프로바이더 등록 |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `constant/` | 검색 파라미터 상수 및 LLM 프롬프트 상수 (see `constant/AGENTS.md`) |
| `dto/` | 요청 DTO (see `dto/AGENTS.md`) |
| `mapper/` | DB 엔티티 ↔ LangChain Document 변환 (see `mapper/AGENTS.md`) |
| `repository/` | MySQL 쿼리 레이어 (see `repository/AGENTS.md`) |
| `service/` | 비즈니스 서비스 — 검색 오케스트레이터, 하이브리드 검색기, CRUD (see `service/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- 검색 파이프라인 흐름: `HospitalController` → `HospitalSearchService` → `HybridRetrieverService` + `RerankService` + `LlmService`
- 검색 파라미터 튜닝(TopK, Score Threshold 등)은 `constant/search.constant.ts`에서 관리
- `HospitalModule`은 `HospitalService`만 외부에 `exports` — 검색 서비스는 내부 전용

### Testing Requirements
- 검색 품질 테스트 시 실제 외부 서비스(Pinecone, OpenAI, Cohere) 필요
- 유닛 테스트 시 `EmbeddingService`, `RerankService`, `LlmService` 목킹 권장

### Common Patterns
- SRP 준수: 각 서비스는 단일 책임 (검색 오케스트레이션 / 하이브리드 검색 / CRUD 분리)
- 병렬 실행: `HybridRetrieverService`에서 키워드·벡터 검색을 `Promise.all`로 동시 실행

## Dependencies

### Internal
- `src/rag/` — EmbeddingService, LlmService, RerankService
- `src/prisma/` — PrismaService

### External
- `@langchain/core/documents` — Document 타입

<!-- MANUAL: -->
