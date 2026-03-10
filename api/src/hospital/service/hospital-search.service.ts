import { Injectable } from '@nestjs/common';
import { StringOutputParser } from '@langchain/core/output_parsers';
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from '@langchain/core/prompts';
import { Document } from '@langchain/core/documents';
import { Hospital, AddressCode } from '../../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { EmbeddingService } from '../../embedding/embedding.service';
import { LangChainService } from '../../langchain/langchain.service';
import { HospitalMetadata } from '../../embedding/interface/vector-metadata.interface';

type HospitalWithAddress = Hospital & { addressCode: AddressCode };

const RRF_K = 60; // RRF 순위 완화 상수
const TOP_K = 10; // 각 검색 소스별 후보 수
const FINAL_K = 5; // 최종 반환 문서 수

const SYSTEM_PROMPT = `당신은 병원 추천 도우미입니다.
검색된 병원 정보를 바탕으로 사용자의 증상이나 요구에 가장 적합한 병원을 추천하세요.

규칙:
- 병원 관련된 질문이 아니라면 정중하게 사과의 메세지로 답변하세요.
- 검색된 병원 정보만 사용하세요. 없는 병원을 만들어내지 마세요.
- 각 병원의 병원명, 주소, 전화번호, 진료과목을 포함해서 답변하세요.
- 왜 해당 병원을 추천하는지 간단한 이유를 함께 설명하세요.
- 간결하고 친절하게 답변하세요.`;

@Injectable()
export class HospitalSearchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly embeddingService: EmbeddingService,
    private readonly langChainService: LangChainService,
  ) {}

  /**
   * 병원 검색 메인 흐름
   * 1. Hybrid Search (키워드 + 벡터 → RRF 합산)
   * 2. 검색 결과를 컨텍스트로 구성
   * 3. LLM 답변 생성
   */
  async search(query: string) {
    const docs = await this.hybridSearch(query);
    const context = this.buildContext(docs);
    const answer = await this.generateAnswer(context, query);

    return {
      answer,
      sources: docs.map((doc) => doc.metadata),
    };
  }

  /** 키워드(LIKE) + 벡터(Pinecone) 병렬 검색 → RRF 합산 */
  private async hybridSearch(
    query: string,
  ): Promise<Document<HospitalMetadata>[]> {
    const [keywordResults, vectorResults] = await Promise.all([
      this.keywordSearch(query),
      this.embeddingService.similaritySearch(query, TOP_K),
    ]);

    return this.rrfFusion(keywordResults, vectorResults);
  }

  /** Prisma ORM 키워드 검색 (contains → LIKE '%keyword%') */
  private async keywordSearch(
    query: string,
  ): Promise<Document<HospitalMetadata>[]> {
    const keywords = query.split(/\s+/).filter(Boolean);

    const hospitals = await this.prisma.hospital.findMany({
      where: {
        deletedAt: null,
        AND: keywords.map((keyword) => ({
          OR: [
            { name: { contains: keyword } },
            { address: { contains: keyword } },
            { specialties: { contains: keyword } },
          ],
        })),
      },
      include: { addressCode: true },
      take: TOP_K,
    });

    return hospitals.map((h) => this.toDocument(h));
  }

  /** RRF: 순위 기반 합산 — 양쪽 검색에서 모두 상위인 문서가 최종 상위 */
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
      .slice(0, FINAL_K)
      .map((r) => r.doc);
  }

  /** 검색된 문서를 LLM 컨텍스트 문자열로 변환 */
  private buildContext(docs: Document<HospitalMetadata>[]): string {
    return docs
      .map((doc, i) => {
        const m = doc.metadata;
        return [
          `[병원 ${i + 1}]`,
          `병원명: ${m.name}`,
          `주소: ${m.address}`,
          `전화번호: ${m.tel}`,
          `진료과목: ${m.specialties || '정보 없음'}`,
          `소개: ${doc.pageContent}`,
        ].join('\n');
      })
      .join('\n\n');
  }

  /** 프롬프트 구성 → LLM 답변 생성 */
  private async generateAnswer(
    context: string,
    query: string,
  ): Promise<string> {
    const prompt = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(SYSTEM_PROMPT),
      HumanMessagePromptTemplate.fromTemplate(
        `검색된 병원 정보:\n{context}\n\n사용자 질문: {query}`,
      ),
    ]);

    const chain = prompt
      .pipe(this.langChainService.getChat())
      .pipe(new StringOutputParser());

    return chain.invoke({ context, query });
  }

  private toDocument(h: HospitalWithAddress): Document<HospitalMetadata> {
    return new Document<HospitalMetadata>({
      pageContent: [
        `진료과목: ${h.specialties ?? '정보 없음'}`,
        h.description ?? '',
      ]
        .filter(Boolean)
        .join('\n'),
      metadata: {
        name: h.name,
        tel: h.tel,
        address: h.address,
        openDate: h.openDate,
        latitude: h.latitude,
        longitude: h.longitude,
        sidoName: h.addressCode.sidoName,
        sigunguName: h.addressCode.sigunguName,
        specialties: h.specialties ?? '',
      },
    });
  }
}
