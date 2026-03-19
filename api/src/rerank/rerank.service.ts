import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Document } from '@langchain/core/documents';
import { HospitalMetadata } from '../embedding/interface/vector-metadata.interface';

interface CohereRerankResponse {
  results: { index: number; relevance_score: number }[];
}

@Injectable()
export class RerankService {
  private readonly apiKey: string;

  constructor(private readonly config: ConfigService) {
    this.apiKey = this.config.get<string>('cohere.apiKey')!;
  }

  /**
   * Cohere Rerank API를 사용하여 문서를 질문과의 관련성 기준으로 재정렬
   * @param query 사용자 질문
   * @param docs RRF 합산 후 후보 문서 목록
   * @param topN 최종 반환할 문서 수
   */
  async rerank(
    query: string,
    docs: Document<HospitalMetadata>[],
    topN: number,
  ): Promise<Document<HospitalMetadata>[]> {
    if (docs.length === 0) return [];

    const documents = this.buildDocumentTexts(docs);
    const response = await this.callCohereApi(
      query,
      documents,
      topN,
      docs.length,
    );

    if (!response.ok) {
      return docs.slice(0, topN);
    }

    const data = (await response.json()) as CohereRerankResponse;

    return data.results.map((result) => docs[result.index]);
  }

  /** 각 문서를 Rerank API에 전달할 텍스트로 변환 */
  private buildDocumentTexts(docs: Document<HospitalMetadata>[]): string[] {
    return docs.map((doc) => {
      const m = doc.metadata;
      return [
        `병원명: ${m.name}`,
        `주소: ${m.address}`,
        `진료과목: ${m.specialties || '정보 없음'}`,
        doc.pageContent,
      ].join('\n');
    });
  }

  /** Cohere Rerank API 호출 */
  private callCohereApi(
    query: string,
    documents: string[],
    topN: number,
    docCount: number,
  ): Promise<Response> {
    return fetch('https://api.cohere.com/v2/rerank', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'rerank-v3.5',
        query,
        documents,
        top_n: Math.min(topN, docCount),
      }),
    });
  }
}
