import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Document } from '@langchain/core/documents';
import { HospitalMetadata } from '../../common/interface/hospital-metadata.interface';

/** 벡터 스토어(Pinecone) 연동 — 임베딩 생성 및 유사도 검색 */
@Injectable()
export class EmbeddingService implements OnModuleInit {
  private vectorStore: PineconeStore;

  private readonly embeddings: OpenAIEmbeddings;

  constructor(private readonly config: ConfigService) {
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: this.config.get<string>('openai.apiKey'),
      model: 'text-embedding-3-small', // 기본 dimensions 출력 1536
      dimensions: 1024, // 무료 Pinecone 인덱스(test-index) > dimensions 출력 1024
    });
  }

  async onModuleInit() {
    const client = new Pinecone({
      apiKey: this.config.get<string>('pinecone.apiKey')!,
    });

    const index = client.Index({
      name: this.config.get<string>('pinecone.indexName')!,
    });

    this.vectorStore = await PineconeStore.fromExistingIndex(this.embeddings, {
      pineconeIndex: index,
    });
  }

  /** 쿼리와 유사한 벡터 문서를 점수와 함께 반환 */
  async similaritySearchWithScore(
    query: string,
    topK: number,
  ): Promise<[Document<HospitalMetadata>, number][]> {
    const results = await this.vectorStore.similaritySearchWithScore(
      query,
      topK,
    );

    return results.map(([doc, score]) => [
      new Document<HospitalMetadata>({
        pageContent: doc.pageContent,
        metadata: doc.metadata as HospitalMetadata,
      }),
      score,
    ]);
  }
}
