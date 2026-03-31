<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-31 | Updated: 2026-03-31 -->

# batch/src

## Purpose
NestJS 배치 서버의 핵심 소스 코드. 병원 임베딩 동기화 기능을 담당하며, 스케줄링과 Pinecone 연동이 핵심이다.

## Key Files

| File | Description |
|------|-------------|
| `main.ts` | 배치 앱 부트스트랩 진입점 |
| `app.module.ts` | 루트 모듈 — ConfigModule, ScheduleModule, PrismaModule, HospitalEmbeddingModule 임포트 |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `config/` | 환경변수 로드 및 검증 (see `config/AGENTS.md`) |
| `hospital-embedding/` | 병원 임베딩 동기화 핵심 로직 (see `hospital-embedding/AGENTS.md`) |
| `prisma/` | PrismaService 및 모듈 (see `prisma/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- `@nestjs/schedule`의 `ScheduleModule.forRoot()`가 루트 모듈에 등록되어야 Cron 작동
- 환경변수: `OPENAI_API_KEY`, `PINECONE_API_KEY`, `PINECONE_INDEX_NAME`, `DATABASE_URL`

<!-- MANUAL: -->
