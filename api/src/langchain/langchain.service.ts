import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';

@Injectable()
export class LangChainService {
  private readonly chat: ChatOpenAI;
  private readonly embeddings: OpenAIEmbeddings;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('openai.apiKey');

    this.chat = new ChatOpenAI({
      openAIApiKey: apiKey,
      model: 'gpt-4o-mini',
      temperature: 0,
    });

    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: apiKey,
      model: 'text-embedding-3-small',
    });
  }

  getChat(): ChatOpenAI {
    return this.chat;
  }

  getEmbeddings(): OpenAIEmbeddings {
    return this.embeddings;
  }
}
