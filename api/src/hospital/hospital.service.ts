import { Injectable } from '@nestjs/common';
import { Hospital } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HospitalService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Hospital[]> {
    return this.prisma.hospital.findMany();
  }

  async findOne(id: number): Promise<Hospital | null> {
    return this.prisma.hospital.findUnique({ where: { id } });
  }
}
