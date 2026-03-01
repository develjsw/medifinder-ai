import { Module } from '@nestjs/common';
import { HospitalEmbeddingService } from './hospital-embedding.service';

@Module({
  providers: [HospitalEmbeddingService],
})
export class HospitalEmbeddingModule {}
