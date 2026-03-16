import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StringOutputParser } from '@langchain/core/output_parsers';
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from '@langchain/core/prompts';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';

@Injectable()
export class LangChainService {
  private readonly chat: ChatOpenAI;
  private readonly embeddings: OpenAIEmbeddings;
  private readonly outputParser = new StringOutputParser();

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('openai.apiKey');

    this.chat = new ChatOpenAI({
      openAIApiKey: apiKey,
      model: 'gpt-4o-mini',
      temperature: 0,
    });

    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: apiKey,
      model: 'text-embedding-3-small', // 기본 dimensions 출력 1536
      dimensions: 1024, // 무료 Pinecone 인덱스(test-index) > dimensions 출력 1024
    });
  }

  /** 시스템 프롬프트 + 사용자 메시지를 받아 LLM 답변을 생성 */
  async generateAnswer(
    systemPrompt: string,
    humanMessage: string,
    variables: Record<string, string>,
  ): Promise<string> {
    const prompt = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(systemPrompt),
      HumanMessagePromptTemplate.fromTemplate(humanMessage),
    ]);

    const messages = await prompt.formatMessages(variables);
    const response = await this.chat.invoke(messages);

    return this.outputParser.invoke(response);
  }

  getEmbeddings(): OpenAIEmbeddings {
    return this.embeddings;
  }
}
