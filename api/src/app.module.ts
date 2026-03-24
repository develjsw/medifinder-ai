import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  openaiConfig,
  pineconeConfig,
  cohereConfig,
} from './config/configuration';
import { validate } from './config/env.validation';
import { PrismaModule } from './prisma/prisma.module';
import { EmbeddingModule } from './embedding/embedding.module';
import { LlmModule } from './llm/llm.module';
import { HospitalModule } from './hospital/hospital.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [openaiConfig, pineconeConfig, cohereConfig],
      validate,
    }),
    PrismaModule,
    LlmModule,
    EmbeddingModule,
    HospitalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
