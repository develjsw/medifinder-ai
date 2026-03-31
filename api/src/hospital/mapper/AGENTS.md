<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-31 | Updated: 2026-03-31 -->

# api/src/hospital/mapper

## Purpose
데이터 변환 레이어. Prisma DB 엔티티를 LangChain `Document` 형식으로 변환하고, 검색 결과 문서 목록을 LLM 프롬프트에 삽입할 컨텍스트 문자열로 포맷팅한다.

## Key Files

| File | Description |
|------|-------------|
| `hospital-document.mapper.ts` | `toDocument()`: DB 엔티티 → LangChain Document 변환 / `buildContext()`: 문서 목록 → LLM 컨텍스트 문자열 |

## For AI Agents

### Working In This Directory
- `toDocument()`의 `pageContent` 형식은 키워드 검색 결과를 벡터 검색 결과와 동일한 구조로 맞추기 위한 것 — 변경 시 Pinecone 임베딩 데이터 포맷과 일치 여부 확인
- `buildContext()`의 출력 형식은 LLM 프롬프트 품질에 직접 영향 — `prompt.constant.ts`의 프롬프트와 함께 검토
- `HospitalWithAddress` 타입은 `repository/hospital.repository.ts`에서 import

<!-- MANUAL: -->
