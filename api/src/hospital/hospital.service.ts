import { Injectable } from '@nestjs/common';
import { StringOutputParser } from '@langchain/core/output_parsers';
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from '@langchain/core/prompts';
import { Hospital } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { EmbeddingService } from '../embedding/embedding.service';
import { LangChainService } from '../langchain/langchain.service';

const SYSTEM_PROMPT = `당신은 병원 추천 도우미입니다.
검색된 병원 정보를 바탕으로 사용자의 증상이나 요구에 가장 적합한 병원을 추천하세요.

규칙:
- 병원 관련된 질문이 아니라면 정중하게 사과의 메세지로 답변하세요.
- 검색된 병원 정보만 사용하세요. 없는 병원을 만들어내지 마세요.
- 각 병원의 병원명, 주소, 전화번호, 진료과목을 포함해서 답변하세요.
- 왜 해당 병원을 추천하는지 간단한 이유를 함께 설명하세요.
- 간결하고 친절하게 답변하세요.`;

@Injectable()
export class HospitalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly embeddingService: EmbeddingService,
    private readonly langChainService: LangChainService,
  ) {}

  async findAll(): Promise<Hospital[]> {
    return this.prisma.hospital.findMany();
  }

  async findOne(id: number): Promise<Hospital | null> {
    return this.prisma.hospital.findUnique({ where: { id } });
  }

  async search(query: string) {
    // 1. 임베딩 기반 유사도 검색
    const docs = await this.embeddingService.similaritySearch(query);

    // 2. 검색된 문서를 컨텍스트로 구성 (pageContent + metadata)
    const context = docs
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

    // 3. 프롬프트 구성 → LLM 답변 생성
    const prompt = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(SYSTEM_PROMPT),
      HumanMessagePromptTemplate.fromTemplate(
        `검색된 병원 정보:\n{context}\n\n사용자 질문: {query}`,
      ),
    ]);

    const chain = prompt
      .pipe(this.langChainService.getChat())
      .pipe(new StringOutputParser());

    const answer = await chain.invoke({ context, query });

    return {
      answer,
      sources: docs.map((doc) => doc.metadata),
    };
  }
}
