import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { EmbeddingModule } from '../embedding/embedding.module';
import { LangChainModule } from '../langchain/langchain.module';
import { RerankModule } from '../rerank/rerank.module';
import { HospitalController } from './hospital.controller';
import { HospitalRepository } from './repository/hospital.repository';
import { HospitalService } from './service/hospital.service';
import { HospitalSearchService } from './service/hospital-search.service';

@Module({
  imports: [PrismaModule, EmbeddingModule, LangChainModule, RerankModule],
  controllers: [HospitalController],
  providers: [HospitalRepository, HospitalService, HospitalSearchService],
  exports: [HospitalService],
})
export class HospitalModule {}
