<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-31 | Updated: 2026-03-31 -->

# api/src/common

## Purpose
애플리케이션 전반에서 공유하는 타입, 인터페이스, 유틸리티를 정의한다. 현재는 병원 벡터 문서의 메타데이터 인터페이스(`HospitalMetadata`)를 포함한다.

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `interface/` | 공유 TypeScript 인터페이스 정의 (see `interface/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- 여러 모듈에서 사용하는 타입은 이 디렉토리에 정의 (중복 방지)
- 특정 도메인에만 속하는 타입은 해당 도메인 모듈 내부에 정의할 것

<!-- MANUAL: -->
