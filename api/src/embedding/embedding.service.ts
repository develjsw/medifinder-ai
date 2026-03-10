import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import { Document } from '@langchain/core/documents';
import { LangChainService } from '../langchain/langchain.service';
import { HospitalMetadata } from './interface/vector-metadata.interface';

@Injectable()
export class EmbeddingService implements OnModuleInit {
  private vectorStore: PineconeStore;

  constructor(
    private readonly config: ConfigService,
    private readonly langChain: LangChainService,
  ) {}

  async onModuleInit() {
    const client = new Pinecone({
      apiKey: this.config.get<string>('pinecone.apiKey')!,
    });

    const index = client.Index({
      name: this.config.get<string>('pinecone.indexName')!,
    });

    this.vectorStore = await PineconeStore.fromExistingIndex(
      this.langChain.getEmbeddings(),
      { pineconeIndex: index },
    );
  }

  // async upsertDocuments(docs: Document<HospitalMetadata>[]) {
  //   await this.vectorStore.addDocuments(docs);
  // }

  async similaritySearch(
    query: string,
    topK = 5,
  ): Promise<Document<HospitalMetadata>[]> {
    const results = await this.vectorStore.similaritySearch(query, topK);

    return results.map(
      (r) =>
        new Document<HospitalMetadata>({
          pageContent: r.pageContent,
          metadata: r.metadata as HospitalMetadata,
        }),
    );
  }
}
