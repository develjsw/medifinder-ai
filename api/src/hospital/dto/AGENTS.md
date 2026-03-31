<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-31 | Updated: 2026-03-31 -->

# api/src/hospital/dto

## Purpose
HTTP 요청 데이터 전송 객체(DTO) 정의. `class-validator` 데코레이터로 입력 검증을 수행한다.

## Key Files

| File | Description |
|------|-------------|
| `search-hospital.dto.ts` | 병원 검색 요청 DTO — `query: string` 필드 (POST /hospitals/search body) |

## For AI Agents

### Working In This Directory
- DTO 필드 추가 시 `class-validator` 데코레이터로 검증 규칙 명시
- `ValidationPipe`가 전역 또는 컨트롤러 레벨에서 활성화되어 있어야 검증 동작

<!-- MANUAL: -->
