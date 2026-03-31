<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-31 | Updated: 2026-03-31 -->

# batch/src/config

## Purpose
배치 앱의 환경변수 로드 및 검증. `api/src/config`와 동일한 패턴이나, Cohere 관련 설정이 없다(배치는 임베딩만 수행, Re-Ranking 불필요).

## Key Files

| File | Description |
|------|-------------|
| `configuration.ts` | 환경변수를 네임스페이스 객체로 변환 (openai, pinecone) |
| `env.validation.ts` | Joi 검증 스키마 — 필수 환경변수 누락 시 앱 시작 실패 |

## For AI Agents

### Working In This Directory
- `api/src/config`와 패턴 동일 — 차이점: Cohere 설정 없음
- 새 환경변수 추가 시: `configuration.ts` → `env.validation.ts` → `app.module.ts` 순서로 업데이트

<!-- MANUAL: -->
