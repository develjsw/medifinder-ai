import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CohereRerank } from '@langchain/cohere';
import { Document } from '@langchain/core/documents';

@Injectable()
export class RerankService {
  private readonly cohereRerank: CohereRerank;

  constructor(private readonly config: ConfigService) {
    this.cohereRerank = new CohereRerank({
      model: 'rerank-v3.5',
      apiKey: this.config.get<string>('cohere.apiKey'),
    });
  }

  /** Cohere Cross-Encoder로 질문-문서 관련성 기준 재정렬 */
  async rerank<T extends Record<string, any>>(
    query: string,
    docs: Document<T>[],
    topN: number,
    scoreThreshold: number,
  ): Promise<Document<T>[]> {
    if (docs.length === 0) return [];

    const texts = docs.map((doc) => doc.pageContent);
    const ranked = await this.cohereRerank.rerank(texts, query, { topN });

    return ranked
      .filter((r) => r.relevanceScore >= scoreThreshold)
      .map((r) => docs[r.index]);
  }
}
