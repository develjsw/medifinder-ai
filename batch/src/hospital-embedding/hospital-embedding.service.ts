import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { Pinecone, Index } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { Document } from '@langchain/core/documents';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { Hospital, AddressCode } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type HospitalWithAddress = Hospital & { addressCode: AddressCode };

const SYMPTOM_PROMPT = `당신은 의료 정보 보조 도우미입니다. 진료과목을 보고 환자가 검색할 만한 관련 증상 키워드를 생성하세요.

규칙:
- 각 진료과목에 대해 대표적인 증상/질환 키워드를 3~5개씩 나열
- 일반인이 사용할 법한 일상적 표현을 포함 (EX. "배가 아프다", "허리가 아프다")
- 쉼표로 구분하여 한 줄로 출력
- 키워드만 출력하고 다른 설명은 하지 마세요`;

@Injectable()
export class HospitalEmbeddingService implements OnModuleInit {
  private vectorStore: PineconeStore;
  private pineconeIndex: Index;
  private chatModel: ChatOpenAI;

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

    this.chatModel = new ChatOpenAI({
      openAIApiKey: this.config.get<string>('openai.apiKey'),
      model: 'gpt-4o-mini',
      temperature: 0,
    });

    await this.syncHospitalEmbeddings();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    await this.syncHospitalEmbeddings();
  }

  /** DB의 신규 병원을 Pinecone에 임베딩 동기화 */
  private async syncHospitalEmbeddings() {
    const hospitals = await this.prisma.hospital.findMany({
      include: { addressCode: true },
    });

    if (hospitals.length === 0) return;

    // Pinecone에 이미 등록된 ID 조회
    const hospitalIds = hospitals.map((h) => `hospital-${h.id}`);
    const existing = await this.pineconeIndex.fetch(hospitalIds);
    const existingIds = new Set(Object.keys(existing.records));

    // 신규 병원만 필터링
    const newHospitals = hospitals.filter(
      (h) => !existingIds.has(`hospital-${h.id}`),
    );

    if (newHospitals.length === 0) return;

    const docs = await Promise.all(newHospitals.map((h) => this.toDocument(h)));
    await this.vectorStore.addDocuments(docs, {
      ids: newHospitals.map((h) => `hospital-${h.id}`),
    });
  }

  /** DB 병원 → Document 변환 (LLM으로 증상 키워드 보강) */
  private async toDocument(hospital: HospitalWithAddress): Promise<Document> {
    const { name, tel, address, openDate, latitude, longitude, specialties } =
      hospital;
    const { sidoName, sigunguName } = hospital.addressCode;

    const contentParts = [
      `병원명: ${name}`,
      `위치: ${sidoName} ${sigunguName}`,
      `진료과목: ${specialties ?? '정보 없음'}`,
    ];

    // 진료과목이 있으면 LLM으로 관련 증상 키워드를 생성하여 추가
    if (specialties) {
      const symptoms = await this.generateSymptoms(specialties);
      if (symptoms) {
        contentParts.push(`관련 증상: ${symptoms}`);
      }
    }

    return new Document({
      pageContent: contentParts.join('\n'),
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

  /** 진료과목으로부터 관련 증상 키워드를 LLM으로 생성 */
  private async generateSymptoms(specialties: string): Promise<string | null> {
    const response = await this.chatModel.invoke([
      new SystemMessage(SYMPTOM_PROMPT),
      new HumanMessage(`진료과목: ${specialties}`),
    ]);

    const content =
      typeof response.content === 'string' ? response.content.trim() : '';

    return content || null;
  }
}
