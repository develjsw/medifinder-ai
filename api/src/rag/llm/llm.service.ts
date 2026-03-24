import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StringOutputParser } from '@langchain/core/output_parsers';
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';

/** LLM 답변 생성 담당 — 채팅 모델 초기화 및 프롬프트 실행 */
@Injectable()
export class LlmService {
  private readonly chat: ChatOpenAI;
  private readonly outputParser = new StringOutputParser();

  constructor(private readonly config: ConfigService) {
    this.chat = new ChatOpenAI({
      openAIApiKey: this.config.get<string>('openai.apiKey'),
      model: 'gpt-4o-mini',
      temperature: 0,
    });
  }

  /** 시스템 프롬프트 + 사용자 메시지 템플릿으로 LLM 답변 생성 */
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
}
