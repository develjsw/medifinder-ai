<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-31 | Updated: 2026-03-31 -->

# api

## Purpose
NestJS 기반 병원 검색 API 서버. 사용자의 자연어 쿼리를 받아 Hybrid Search(SQL LIKE 키워드 검색 + Pinecone 벡터 검색) → RRF 합산 → Cohere Re-Ranking → GPT-4o-mini 답변 생성 파이프라인을 실행하여 관련 병원과 AI 답변을 반환한다.

## Key Files

| File | Description |
|------|-------------|
| `package.json` | 의존성 목록 (NestJS, LangChain, Prisma, Pinecone SDK 등) |
| `tsconfig.json` | TypeScript 컴파일 설정 |
| `nest-cli.json` | NestJS CLI 설정 |
| `eslint.config.mjs` | ESLint 규칙 |
| `.prettierrc` | Prettier 포맷 설정 |
| `pnpm-lock.yaml` | pnpm 잠금 파일 |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `prisma/` | Prisma 스키마 (Hospital, AddressCode 모델) (see `prisma/AGENTS.md`) |
| `src/` | 애플리케이션 소스 코드 (see `src/AGENTS.md`) |
| `test/` | E2E 테스트 (see `test/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- 패키지 매니저는 **pnpm** 사용
- 환경변수 필수: `OPENAI_API_KEY`, `PINECONE_API_KEY`, `PINECONE_INDEX_NAME`, `COHERE_API_KEY`, `DATABASE_URL`
- Prisma 클라이언트 생성 경로: `generated/prisma/` (`.gitignore`에 포함)
- 스키마 변경 후 반드시 `pnpm prisma generate` 실행

### Testing Requirements
- 단위 테스트: `pnpm test`
- E2E 테스트: `pnpm test:e2e`
- 개발 서버: `pnpm start:dev`

### Common Patterns
- 모든 모듈은 NestJS `@Module()` 데코레이터로 구성
- 서비스 의존성은 생성자 주입(Constructor Injection) 사용
- 환경변수는 `ConfigService`를 통해 접근 (직접 `process.env` 사용 금지)

## Dependencies

### Internal
- `batch/` — 동일한 MySQL DB와 Pinecone 인덱스를 공유

### External
- `@nestjs/*` — 프레임워크
- `@langchain/openai`, `@langchain/pinecone`, `@langchain/cohere` — AI 인프라
- `@prisma/client` — MySQL ORM

<!-- MANUAL: -->
