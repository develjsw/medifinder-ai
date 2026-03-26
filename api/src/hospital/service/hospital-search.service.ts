import { Injectable } from '@nestjs/common';
import { LlmService } from '../../rag/llm/llm.service';
import { RerankService } from '../../rag/rerank/rerank.service';
import { HybridRetrieverService } from './hybrid-retriever.service';
import { HospitalDocumentMapper } from '../mapper/hospital-document.mapper';
import { FINAL_K, RERANK_SCORE_THRESHOLD } from '../constant/search.constant';
import { SYSTEM_PROMPT, HUMAN_MESSAGE } from '../constant/prompt.constant';

/**
 * 병원 검색 오케스트레이터
 * 각 단계(검색 → 재정렬 → 답변 생성)를 조율만 담당
 */
@Injectable()
export class HospitalSearchService {
  constructor(
    private readonly hybridRetrieverService: HybridRetrieverService,
    private readonly rerankService: RerankService,
    private readonly llmService: LlmService,
    private readonly hospitalDocumentMapper: HospitalDocumentMapper,
  ) {}

  /**
   * 병원 검색 메인 흐름
   * 1. Hybrid Search (키워드 + 벡터 → RRF 합산)
   * 2. Re-Ranking (Cohere Cross-Encoder로 관련성 재정렬)
   * 3. LLM 답변 생성
   */
  async search(query: string) {
    const retrievedDocs = await this.hybridRetrieverService.retrieve(query);
    const rankedDocs = await this.rerankService.rerank(
      query,
      retrievedDocs,
      FINAL_K,
      RERANK_SCORE_THRESHOLD,
    );

    if (!rankedDocs.length) {
      return { answer: '', sources: [] };
    }

    const context = this.hospitalDocumentMapper.buildContext(rankedDocs);
    const answer = await this.llmService.generateAnswer(
      SYSTEM_PROMPT,
      HUMAN_MESSAGE,
      { context, query },
    );

    return {
      answer,
      sources: rankedDocs.map((doc) => doc.metadata),
    };
  }
}
