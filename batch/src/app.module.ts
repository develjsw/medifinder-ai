import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { openaiConfig, pineconeConfig } from './config/configuration';
import { validate } from './config/env.validation';
import { PrismaModule } from './prisma/prisma.module';
import { HospitalEmbeddingModule } from './hospital-embedding/hospital-embedding.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [openaiConfig, pineconeConfig],
      validate,
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    HospitalEmbeddingModule,
  ],
})
export class AppModule {}
