import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { Pinecone, Index } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Document } from '@langchain/core/documents';
import { Hospital, AddressCode } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type HospitalWithAddress = Hospital & { addressCode: AddressCode };

@Injectable()
export class HospitalEmbeddingService implements OnModuleInit {
  private readonly logger = new Logger(HospitalEmbeddingService.name);
  private vectorStore: PineconeStore;
  private pineconeIndex: Index;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit() {
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: this.config.get<string>('openai.apiKey'),
      model: 'text-embedding-3-small',
      dimensions: 1024,
    });

    const pinecone = new Pinecone({
      apiKey: this.config.get<string>('pinecone.apiKey')!,
    });

    this.pineconeIndex = pinecone.Index(
      this.config.get<string>('pinecone.indexName')!,
    );

    this.vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: this.pineconeIndex,
    });

    // 최초 기동 시 1회 동기화
    await this.syncHospitalEmbeddings();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    this.logger.debug('Scheduled hospital embedding sync started');
    await this.syncHospitalEmbeddings();
  }

  private async syncHospitalEmbeddings() {
    const hospitals = await this.prisma.hospital.findMany({
      include: { addressCode: true },
    });
    this.logger.debug(`Found ${hospitals.length} hospitals in DB`);

    if (hospitals.length === 0) return;

    // Pinecone에 이미 등록된 ID 조회
    const hospitalIds = hospitals.map((hospital) => `hospital-${hospital.id}`);
    const existing = await this.pineconeIndex.fetch(hospitalIds);
    const existingIds = new Set(Object.keys(existing.records));

    // 신규 병원만 필터링
    const newHospitals = hospitals.filter(
      (hospital) => !existingIds.has(`hospital-${hospital.id}`),
    );

    if (newHospitals.length === 0) {
      this.logger.debug('No new hospitals to embed. Skipping.');
      return;
    }

    const docs = newHospitals.map((h) => this.toDocument(h));
    await this.vectorStore.addDocuments(docs, {
      ids: newHospitals.map((hospital) => `hospital-${hospital.id}`),
    });

    this.logger.debug(
      `Upserted ${docs.length} new documents (skipped ${existingIds.size} existing)`,
    );
  }

  private toDocument(hospital: HospitalWithAddress): Document {
    const {
      name,
      tel,
      address,
      openDate,
      latitude,
      longitude,
      specialties,
      description,
      addressCode,
    } = hospital;
    const { sidoName, sigunguName } = addressCode;

    // pageContent: 비정형 텍스트 → 임베딩 유사도 검색 대상
    const contentParts = [
      `진료과목: ${specialties ?? '정보 없음'}`,
      description ?? '',
    ];

    return new Document({
      pageContent: contentParts.filter(Boolean).join('\n'),
      // metadata: 구조화 데이터 → 필터링/표시용
      metadata: {
        name,
        tel,
        address,
        openDate,
        latitude,
        longitude,
        sidoName,
        sigunguName,
        specialties: specialties ?? '',
      },
    });
  }
}
