import { Injectable } from '@nestjs/common';
import { Document } from '@langchain/core/documents';
import { HospitalMetadata } from '../../common/interface/hospital-metadata.interface';
import { EmbeddingService } from '../../rag/embedding/embedding.service';
import { HospitalRepository } from '../repository/hospital.repository';
import { HospitalDocumentMapper } from '../mapper/hospital-document.mapper';
import {
  RRF_K,
  TOP_K,
  RERANK_CANDIDATES,
  SCORE_THRESHOLD,
} from '../constant/search.constant';

/** 키워드(SQL LIKE) + 벡터(Pinecone) 하이브리드 검색 및 RRF 퓨전 */
@Injectable()
export class HybridRetrieverService {
  constructor(
    private readonly hospitalRepository: HospitalRepository,
    private readonly hospitalDocumentMapper: HospitalDocumentMapper,
    private readonly embeddingService: EmbeddingService,
  ) {}

  /** 키워드·벡터 병렬 검색 → Score Filtering → RRF 합산 */
  async retrieve(query: string): Promise<Document<HospitalMetadata>[]> {
    const keywords = query.split(/\s+/).filter(Boolean);

    const [keywordDocs, scoredVectorDocs] = await Promise.all([
      this.hospitalRepository
        .findByKeywords(keywords, TOP_K)
        .then((hospitals) =>
          hospitals.map((h) => this.hospitalDocumentMapper.toDocument(h)),
        ),
      this.embeddingService.similaritySearchWithScore(query, TOP_K),
    ]);

    const vectorDocs = scoredVectorDocs
      .filter(([, score]) => score >= SCORE_THRESHOLD)
      .map(([doc]) => doc);

    return this.rrfFusion(keywordDocs, vectorDocs);
  }

  /**
   * Reciprocal Rank Fusion
   * 양쪽 검색에서 모두 상위인 문서가 최종 상위로 올라옴
   */
  private rrfFusion(
    ...docSets: Document<HospitalMetadata>[][]
  ): Document<HospitalMetadata>[] {
    const scoreMap = new Map<
      string,
      { doc: Document<HospitalMetadata>; score: number }
    >();

    for (const docs of docSets) {
      docs.forEach((doc, rank) => {
        const key = doc.metadata.name;
        const rrfScore = 1 / (RRF_K + rank + 1);
        const entry = scoreMap.get(key);

        if (entry) {
          entry.score += rrfScore;
        } else {
          scoreMap.set(key, { doc, score: rrfScore });
        }
      });
    }

    return [...scoreMap.values()]
      .sort((a, b) => b.score - a.score)
      .slice(0, RERANK_CANDIDATES)
      .map((r) => r.doc);
  }
}
