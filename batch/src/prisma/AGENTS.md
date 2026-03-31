<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-31 | Updated: 2026-03-31 -->

# batch/src/prisma

## Purpose
배치 앱의 PrismaService 및 모듈. `api/src/prisma`와 동일한 구조로, Prisma 클라이언트를 NestJS 서비스로 래핑하여 DI 컨테이너에 제공한다.

## Key Files

| File | Description |
|------|-------------|
| `prisma.service.ts` | PrismaClient 래퍼 — DB 연결 라이프사이클 관리 |
| `prisma.module.ts` | 전역 모듈 — PrismaService 제공 |

## For AI Agents

### Working In This Directory
- `api/src/prisma`와 동일한 패턴 — 별도 앱이므로 독립적인 서비스 인스턴스

<!-- MANUAL: -->
