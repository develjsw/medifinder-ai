<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-31 | Updated: 2026-03-31 -->

# api/src/prisma

## Purpose
Prisma 클라이언트를 NestJS 서비스로 감싸는 레이어. `PrismaService`는 `PrismaClient`를 확장하며 앱 라이프사이클에 맞춰 DB 연결을 관리한다. `PrismaModule`은 전역 모듈로 등록되어 어디서든 주입 가능하다.

## Key Files

| File | Description |
|------|-------------|
| `prisma.service.ts` | PrismaClient 래퍼 — `onModuleInit()`에서 DB 연결, `onModuleDestroy()`에서 연결 해제 |
| `prisma.module.ts` | 전역 모듈 선언 (`@Global()`) — PrismaService를 exports로 제공 |

## For AI Agents

### Working In This Directory
- DB 쿼리가 필요한 모든 서비스는 `PrismaService`를 생성자 주입으로 사용
- `PrismaModule`은 전역이므로 다른 모듈에서 별도 import 없이 `PrismaService` 주입 가능
  (단, `app.module.ts`에서 `PrismaModule`은 한 번 import 필요)

<!-- MANUAL: -->
