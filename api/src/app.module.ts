import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { openaiConfig, pineconeConfig } from './config/configuration';
import { validate } from './config/env.validation';
import { EmbeddingModule } from './embedding/embedding.module';
import { LangChainModule } from './langchain/langchain.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [openaiConfig, pineconeConfig],
      validate,
    }),
    LangChainModule,
    EmbeddingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
