<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-31 | Updated: 2026-03-31 -->

# batch/prisma

## Purpose
배치 앱의 Prisma ORM 스키마. `api/prisma/schema.prisma`와 동일한 DB 구조를 정의한다. 배치 앱은 읽기 전용으로 병원 데이터를 조회하여 Pinecone에 임베딩한다.

## Key Files

| File | Description |
|------|-------------|
| `schema.prisma` | DB 모델 정의 — api와 동일한 `AddressCode`, `Hospital` 모델 |

## For AI Agents

### Working In This Directory
- 스키마 변경 시 `api/prisma/schema.prisma`와 **동기화 필수** — 두 앱이 같은 DB를 사용
- 클라이언트 생성: `batch/` 디렉토리에서 `pnpm prisma generate`

<!-- MANUAL: -->
