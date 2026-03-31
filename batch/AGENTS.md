<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-31 | Updated: 2026-03-31 -->

# batch

## Purpose
NestJS 기반 배치 서버. MySQL에 저장된 병원 데이터를 Pinecone 벡터 DB에 임베딩하여 동기화한다. 모듈 초기화 시 즉시 동기화를 실행하고, 이후 매일 자정(Cron)에 신규 병원 데이터를 추가 임베딩한다. 임베딩 시 GPT-4o-mini로 진료과목별 증상 키워드를 LLM이 자동 생성하여 벡터 품질을 향상시킨다.

## Key Files

| File | Description |
|------|-------------|
| `package.json` | 의존성 목록 (NestJS Schedule, LangChain, Prisma 등) |
| `tsconfig.json` | TypeScript 컴파일 설정 |
| `nest-cli.json` | NestJS CLI 설정 |
| `eslint.config.mjs` | ESLint 규칙 |
| `.prettierrc` | Prettier 포맷 설정 |
| `pnpm-lock.yaml` | pnpm 잠금 파일 |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `prisma/` | Prisma 스키마 (api와 동일 구조) (see `prisma/AGENTS.md`) |
| `src/` | 배치 애플리케이션 소스 코드 (see `src/AGENTS.md`) |
| `test/` | E2E 테스트 (see `test/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- 패키지 매니저는 **pnpm** 사용
- 환경변수 필수: `OPENAI_API_KEY`, `PINECONE_API_KEY`, `PINECONE_INDEX_NAME`, `DATABASE_URL`
- Pinecone에 이미 존재하는 병원 ID(`hospital-{id}`)는 건너뜀 — 멱등성(idempotency) 보장
- `@nestjs/schedule`의 `@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)` 사용

### Testing Requirements
- E2E 테스트: `pnpm test:e2e`
- 개발 서버: `pnpm start:dev` (실행 즉시 임베딩 동기화 시작)

### Common Patterns
- 임베딩 ID 형식: `hospital-{id}` (Pinecone에서 중복 체크에 사용)
- LLM 증상 키워드 생성은 진료과목이 있는 병원에만 적용
- `onModuleInit()`에서 Pinecone 연결 및 초기 동기화 실행

## Dependencies

### Internal
- `api/` — 동일한 MySQL DB와 Pinecone 인덱스 공유

### External
- `@nestjs/schedule` — Cron 스케줄러
- `@langchain/openai`, `@langchain/pinecone` — 임베딩 및 벡터 스토어
- `@prisma/client` — MySQL ORM

<!-- MANUAL: -->
