import { Module } from '@nestjs/common';
import { LangChainModule } from '../langchain/langchain.module';
import { EmbeddingService } from './embedding.service';

@Module({
  imports: [LangChainModule],
  providers: [EmbeddingService],
  exports: [EmbeddingService],
})
export class EmbeddingModule {}
