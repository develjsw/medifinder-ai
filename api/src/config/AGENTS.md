<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-31 | Updated: 2026-03-31 -->

# api/src/config

## Purpose
NestJS 환경변수 로드 및 검증 설정. `configuration.ts`에서 외부 서비스(OpenAI, Pinecone, Cohere) API 키를 네임스페이스로 구조화하여 제공하고, `env.validation.ts`에서 Joi 스키마로 필수 환경변수를 검증한다.

## Key Files

| File | Description |
|------|-------------|
| `configuration.ts` | 환경변수를 네임스페이스 객체로 변환 (`openai.apiKey`, `pinecone.apiKey`, `cohere.apiKey` 등) |
| `env.validation.ts` | Joi 검증 스키마 — 필수 환경변수 누락 시 앱 시작 실패 |

## For AI Agents

### Working In This Directory
- 새 외부 서비스 추가 시: `configuration.ts`에 네임스페이스 추가 → `env.validation.ts`에 Joi 규칙 추가 → `app.module.ts`의 `load` 배열에 등록
- `ConfigService.get<T>('namespace.key')` 형태로 접근 (예: `config.get<string>('openai.apiKey')`)
- 환경변수 직접 참조(`process.env.KEY`) 대신 반드시 `ConfigService` 사용

### Common Patterns
- `registerAs('namespace', () => ({ key: process.env.KEY }))` 패턴으로 네임스페이스 설정 등록

## Dependencies

### External
- `@nestjs/config` — ConfigModule, ConfigService
- `joi` — 환경변수 검증

<!-- MANUAL: -->
