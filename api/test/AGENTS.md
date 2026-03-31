<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-31 | Updated: 2026-03-31 -->

# api/test

## Purpose
NestJS E2E(End-to-End) 테스트 디렉토리. 실제 HTTP 요청을 시뮬레이션하여 API 엔드포인트의 통합 동작을 검증한다.

## Key Files

| File | Description |
|------|-------------|
| `app.e2e-spec.ts` | 앱 E2E 테스트 스펙 |
| `jest-e2e.json` | E2E 전용 Jest 설정 |

## For AI Agents

### Working In This Directory
- E2E 실행: `api/` 디렉토리에서 `pnpm test:e2e`
- E2E 테스트는 실제 외부 서비스(Pinecone, OpenAI, Cohere) 연결이 필요할 수 있음 — 환경변수 설정 확인

### Common Patterns
- NestJS `Test.createTestingModule()` 패턴 사용
- Supertest로 HTTP 요청 시뮬레이션

<!-- MANUAL: -->
