<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-31 | Updated: 2026-03-31 -->

# batch/src/hospital-embedding

## Purpose
병원 데이터의 Pinecone 벡터 임베딩 동기화 핵심 로직. MySQL의 병원 데이터를 읽어 LLM으로 증상 키워드를 생성하고, Pinecone에 아직 없는 신규 병원만 임베딩하여 저장한다. 모듈 초기화 시 즉시 실행, 이후 매일 자정 Cron으로 반복 실행된다.

## Key Files

| File | Description |
|------|-------------|
| `hospital-embedding.service.ts` | 임베딩 동기화 서비스 — 신규 병원 필터링, LLM 증상 키워드 생성, Pinecone 업로드 |
| `hospital-embedding.module.ts` | 모듈 구성 — PrismaModule, ScheduleModule 의존 |

## For AI Agents

### Working In This Directory
- **멱등성 보장**: Pinecone에 `hospital-{id}` ID로 fetch하여 이미 존재하는 병원은 건너뜀
- **LLM 증상 키워드 생성**: 진료과목(`specialties`)이 있는 병원에 한해 GPT-4o-mini로 관련 증상 키워드를 생성하여 `pageContent`에 추가 → 벡터 검색 품질 향상
- **임베딩 모델**: `text-embedding-3-small`, dimensions=1024 (Pinecone 무료 인덱스 제약)
- Cron 표현식: `CronExpression.EVERY_DAY_AT_MIDNIGHT` (매일 자정)

### Common Patterns
- `onModuleInit()`: Pinecone/OpenAI 클라이언트 초기화 + 첫 동기화 실행
- `handleCron()`: Cron 트리거 시 `syncHospitalEmbeddings()` 호출
- `toDocument()`: DB 엔티티 → LangChain `Document` 변환 (LLM 키워드 포함)

## Dependencies

### Internal
- `batch/src/prisma/` — PrismaService (병원 DB 조회)

### External
- `@langchain/openai` — OpenAIEmbeddings, ChatOpenAI
- `@langchain/pinecone` — PineconeStore
- `@nestjs/schedule` — Cron 스케줄러

<!-- MANUAL: -->
