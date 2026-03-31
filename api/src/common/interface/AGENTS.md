<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-31 | Updated: 2026-03-31 -->

# api/src/common/interface

## Purpose
애플리케이션 전반에서 공유하는 TypeScript 인터페이스 정의. 현재 Pinecone 벡터 문서의 메타데이터 구조를 정의하는 `HospitalMetadata`가 포함된다.

## Key Files

| File | Description |
|------|-------------|
| `hospital-metadata.interface.ts` | 병원 벡터 문서 메타데이터 인터페이스 — name, tel, address, openDate, latitude, longitude, sidoName, sigunguName, specialties |

## For AI Agents

### Working In This Directory
- `HospitalMetadata`는 `EmbeddingService`, `HospitalDocumentMapper`, `HybridRetrieverService`에서 제네릭 타입으로 사용
- Pinecone 문서의 `metadata` 필드 구조와 반드시 일치해야 함
- 필드 추가/변경 시 임베딩된 기존 데이터와의 호환성 확인 필요

<!-- MANUAL: -->
