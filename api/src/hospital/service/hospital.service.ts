import { Injectable } from '@nestjs/common';
import { Hospital } from '../../../generated/prisma/client';
import { HospitalRepository } from '../repository/hospital.repository';

@Injectable()
export class HospitalService {
  constructor(private readonly hospitalRepository: HospitalRepository) {}

  async findAll(): Promise<Hospital[]> {
    return this.hospitalRepository.findAll();
  }

  async findOne(id: number): Promise<Hospital | null> {
    return this.hospitalRepository.findOne(id);
  }
}
