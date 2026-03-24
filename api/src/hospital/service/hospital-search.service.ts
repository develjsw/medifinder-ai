import { Injectable } from '@nestjs/common';
import { LlmService } from '../../rag/llm/llm.service';
import { RerankService } from '../../rag/rerank/rerank.service';
import { HybridRetrieverService } from './hybrid-retriever.service';
import { HospitalDocumentMapper } from '../mapper/hospital-document.mapper';
import { FINAL_K } from '../constant/search.constant';
import { SYSTEM_PROMPT, HUMAN_MESSAGE } from '../constant/prompt.constant';

/**
 * 병원 검색 오케스트레이터
 * 각 단계(검색 → 재정렬 → 답변 생성)를 조율만 담당
 */
@Injectable()
export class HospitalSearchService {
  constructor(
    private readonly retriever: HybridRetrieverService,
    private readonly rerankService: RerankService,
    private readonly llmService: LlmService,
    private readonly mapper: HospitalDocumentMapper,
  ) {}

  /**
   * 병원 검색 메인 흐름
   * 1. Hybrid Search (키워드 + 벡터 → RRF 합산)
   * 2. Re-Ranking (Cohere Cross-Encoder로 관련성 재정렬)
   * 3. LLM 답변 생성
   */
  async search(query: string) {
    const candidates = await this.retriever.retrieve(query);
    const docs = await this.rerankService.rerank(query, candidates, FINAL_K);

    if (!docs.length) {
      return { answer: '', sources: [] };
    }

    const context = this.mapper.buildContext(docs);
    const answer = await this.llmService.generateAnswer(
      SYSTEM_PROMPT,
      HUMAN_MESSAGE,
      { context, query },
    );

    return {
      answer,
      sources: docs.map((doc) => doc.metadata),
    };
  }
}
