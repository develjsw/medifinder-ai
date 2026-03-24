import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RagModule } from '../rag/rag.module';
import { HospitalController } from './hospital.controller';
import { HospitalRepository } from './repository/hospital.repository';
import { HospitalDocumentMapper } from './mapper/hospital-document.mapper';
import { HospitalService } from './service/hospital.service';
import { HospitalSearchService } from './service/hospital-search.service';
import { HybridRetrieverService } from './service/hybrid-retriever.service';

@Module({
  imports: [PrismaModule, RagModule],
  controllers: [HospitalController],
  providers: [
    HospitalRepository,
    HospitalDocumentMapper,
    HospitalService,
    HospitalSearchService,
    HybridRetrieverService,
  ],
  exports: [HospitalService],
})
export class HospitalModule {}
