<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-31 | Updated: 2026-03-31 -->

# api/src

## Purpose
NestJS API 서버의 핵심 소스 코드. 애플리케이션 진입점, 루트 모듈, 그리고 기능별 하위 모듈(hospital, rag, prisma, config)로 구성된다.

## Key Files

| File | Description |
|------|-------------|
| `main.ts` | NestJS 애플리케이션 부트스트랩 진입점 |
| `app.module.ts` | 루트 모듈 — ConfigModule, PrismaModule, RagModule, HospitalModule 임포트 |
| `app.controller.ts` | 루트 컨트롤러 (헬스체크 등 기본 엔드포인트) |
| `app.service.ts` | 루트 서비스 |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `common/` | 공유 인터페이스 및 타입 정의 (see `common/AGENTS.md`) |
| `config/` | 환경변수 로드 및 검증 (see `config/AGENTS.md`) |
| `hospital/` | 병원 검색 도메인 모듈 — 컨트롤러, 서비스, 레포지토리 (see `hospital/AGENTS.md`) |
| `prisma/` | PrismaService 및 모듈 (see `prisma/AGENTS.md`) |
| `rag/` | RAG 인프라 모듈 — 임베딩, LLM, Re-Ranking (see `rag/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- `app.module.ts`의 모듈 임포트 순서: ConfigModule(전역) → PrismaModule → RagModule → HospitalModule
- 새 도메인 모듈 추가 시 `app.module.ts`의 `imports` 배열에 등록 필요
- 환경변수 설정은 `config/` 디렉토리에서 관리 — `process.env` 직접 참조 금지

### Common Patterns
- 기능 단위로 모듈 분리 (NestJS 모듈 시스템 준수)
- 크로스 모듈 의존성은 `exports` 배열을 통해 노출

## Dependencies

### Internal
- 모든 하위 모듈이 이 디렉토리에서 조합됨

<!-- MANUAL: -->
