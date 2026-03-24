import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CohereRerank } from '@langchain/cohere';
import { Document } from '@langchain/core/documents';
import { HospitalMetadata } from '../common/interface/hospital-metadata.interface';

const RERANK_SCORE_THRESHOLD = 0.6; // Rerank 관련성 임계값 (0~1) : 테스트하면서 조절해야 할 값

@Injectable()
export class RerankService {
  private readonly reranker: CohereRerank;

  constructor(private readonly config: ConfigService) {
    this.reranker = new CohereRerank({
      model: 'rerank-v3.5',
      apiKey: this.config.get<string>('cohere.apiKey'),
    });
  }

  /** Cohere Cross-Encoder로 질문-문서 관련성 기준 재정렬 */
  async rerank(
    query: string,
    docs: Document<HospitalMetadata>[],
    topN: number,
  ): Promise<Document<HospitalMetadata>[]> {
    if (docs.length === 0) return [];

    const texts = docs.map((doc) => doc.pageContent);
    const ranked = await this.reranker.rerank(texts, query, { topN });

    return ranked
      .filter((r) => r.relevanceScore >= RERANK_SCORE_THRESHOLD)
      .map((r) => docs[r.index]);
  }
}
