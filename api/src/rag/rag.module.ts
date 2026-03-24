import { Module } from '@nestjs/common';
import { EmbeddingModule } from './embedding/embedding.module';
import { LlmModule } from './llm/llm.module';
import { RerankModule } from './rerank/rerank.module';

/** RAG 인프라 통합 모듈 — 임베딩, LLM, 재정렬을 하나로 묶어 제공 */
@Module({
  imports: [EmbeddingModule, LlmModule, RerankModule],
  exports: [EmbeddingModule, LlmModule, RerankModule],
})
export class RagModule {}
