<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-31 | Updated: 2026-03-31 -->

# api/src/hospital/repository

## Purpose
MySQL 데이터베이스 쿼리 레이어. Prisma를 통해 병원 데이터를 조회하는 Repository 패턴 구현. Hybrid Search의 키워드 검색 부분을 담당한다.

## Key Files

| File | Description |
|------|-------------|
| `hospital.repository.ts` | `findAll()`, `findOne(id)`, `findByKeywords(keywords, limit)` — 키워드 검색은 name/address/specialties 컬럼에 LIKE 검색 |

## For AI Agents

### Working In This Directory
- `findByKeywords()`: 각 키워드를 AND 조건으로 연결, 각 키워드는 name/address/specialties 중 하나라도 포함하면 OR 매칭
- `HospitalWithAddress` 타입: `Hospital & { addressCode: AddressCode }` — `include: { addressCode: true }` 쿼리 결과 타입
- Soft delete 적용: `deletedAt: null` 조건으로 삭제된 병원 자동 제외 (`findByKeywords`에서만 적용)
- `findAll()`, `findOne()`은 삭제 필터 없음 — 필요 시 추가 고려

<!-- MANUAL: -->
