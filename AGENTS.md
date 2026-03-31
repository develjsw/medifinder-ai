<!-- Generated: 2026-03-31 | Updated: 2026-03-31 -->

# medifinder-ai

## Purpose
RAG(Retrieval-Augmented Generation) 기반 병원 검색 AI 서비스. 사용자의 자연어 질문(증상, 지역 등)을 받아 Hybrid Search(키워드 + 벡터) → RRF 합산 → Cohere Re-Ranking → GPT-4o-mini 답변 생성 파이프라인으로 관련 병원을 추천한다. 두 개의 독립적인 NestJS 애플리케이션으로 구성된다: 검색 요청을 처리하는 `api`와 병원 데이터를 Pinecone에 임베딩·동기화하는 `batch`.

## Key Files

| File | Description |
|------|-------------|
| `docker-compose.yml` | MySQL 8.0 컨테이너 설정 (port 3309, DB: medifinder-ai) |
| `README.md` | 프로젝트 개요 및 RAG 개념 설명, 기술 스택, 개발 회고 |
| `.gitignore` | 루트 레벨 git 무시 규칙 |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `api/` | NestJS 검색 API 서버 — 병원 검색 엔드포인트 및 RAG 파이프라인 (see `api/AGENTS.md`) |
| `batch/` | NestJS 배치 서버 — 병원 데이터를 Pinecone 벡터 DB에 임베딩 동기화 (see `batch/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- 루트에는 설정 파일과 문서만 존재하며, 애플리케이션 코드는 `api/`와 `batch/`에 있다
- 두 앱은 동일한 MySQL DB와 Pinecone 인덱스를 공유한다
- 각 앱은 독립적인 `package.json`, `tsconfig.json`, `prisma/schema.prisma`를 가진다
- DB 변경 시 `api/prisma/schema.prisma`와 `batch/prisma/schema.prisma` 모두 업데이트해야 한다

### Testing Requirements
- 각 앱 내에서 개별적으로 테스트 실행 (`api/` 또는 `batch/` 디렉토리에서)
- E2E 테스트: `api/test/`, `batch/test/` 참고

### Common Patterns
- 두 앱 모두 `@nestjs/config` + Joi 검증으로 환경변수 관리
- LangChain TypeScript SDK (`@langchain/*`) 사용
- OpenAI `text-embedding-3-small` 모델, dimensions=1024 (Pinecone 무료 인덱스 제약)
- MySQL soft delete 패턴: `deletedAt` 컬럼 사용

## Dependencies

### External Services
- **OpenAI** — GPT-4o-mini (LLM 답변 생성), text-embedding-3-small (임베딩)
- **Pinecone** — 벡터 DB (유사도 검색)
- **Cohere** — rerank-v3.5 (Re-Ranking)
- **MySQL 8.0** — 병원 정형 데이터 저장 (docker-compose로 로컬 실행)

<!-- MANUAL: -->
