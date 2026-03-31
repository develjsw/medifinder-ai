<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-31 | Updated: 2026-03-31 -->

# api/prisma

## Purpose
Prisma ORM 스키마 정의. MySQL 데이터베이스의 `Hospital`(병원)과 `AddressCode`(행정구역 코드) 테이블 구조를 정의한다. Prisma 클라이언트는 `../generated/prisma/`에 생성된다.

## Key Files

| File | Description |
|------|-------------|
| `schema.prisma` | DB 모델 정의 — `AddressCode`, `Hospital` 모델 및 관계 |

## For AI Agents

### Working In This Directory
- 스키마 변경 후 반드시 `pnpm prisma generate` 실행 (루트가 아닌 `api/` 디렉토리에서)
- `Hospital.specialties`는 nullable (`String?`) — 진료과목 없는 병원 존재
- Soft delete 패턴: `deletedAt` 컬럼으로 삭제 여부 판단 (`deletedAt: null`이면 활성)
- `AddressCode`는 시도(sido)/시군구(sigungu) 행정구역 코드 테이블

### Common Patterns
- 모든 모델에 `createdAt`, `updatedAt`, `deletedAt` 타임스탬프 컬럼 존재
- 컬럼명 매핑: camelCase(Prisma) ↔ snake_case(DB), `@map()` 사용
- `Hospital.addressCodeId`로 `AddressCode`와 FK 관계

## Dependencies

### External
- `prisma` — ORM 및 마이그레이션 도구
- MySQL 8.0 (docker-compose로 실행)

<!-- MANUAL: -->
