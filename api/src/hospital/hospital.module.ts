import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { EmbeddingModule } from '../embedding/embedding.module';
import { LlmModule } from '../llm/llm.module';
import { RerankModule } from '../rerank/rerank.module';
import { HospitalController } from './hospital.controller';
import { HospitalRepository } from './repository/hospital.repository';
import { HospitalDocumentMapper } from './mapper/hospital-document.mapper';
import { HybridRetrieverService } from './service/hybrid-retriever.service';
import { HospitalService } from './service/hospital.service';
import { HospitalSearchService } from './service/hospital-search.service';

@Module({
  imports: [PrismaModule, EmbeddingModule, LlmModule, RerankModule],
  controllers: [HospitalController],
  providers: [
    HospitalRepository,
    HospitalDocumentMapper,
    HybridRetrieverService,
    HospitalService,
    HospitalSearchService,
  ],
  exports: [HospitalService],
})
export class HospitalModule {}
