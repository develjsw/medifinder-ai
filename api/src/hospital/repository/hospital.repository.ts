import { Injectable } from '@nestjs/common';
import { Hospital, AddressCode } from '../../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export type HospitalWithAddress = Hospital & { addressCode: AddressCode };

@Injectable()
export class HospitalRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Hospital[]> {
    return this.prisma.hospital.findMany({ where: { deletedAt: null } });
  }

  async findOne(id: number): Promise<Hospital | null> {
    return this.prisma.hospital.findFirst({ where: { id, deletedAt: null } });
  }

  /** 키워드 검색 (contains → LIKE '%keyword%') */
  async findByKeywords(
    keywords: string[],
    limit: number,
  ): Promise<HospitalWithAddress[]> {
    return this.prisma.hospital.findMany({
      where: {
        deletedAt: null,
        AND: keywords.map((keyword) => ({
          OR: [
            { name: { contains: keyword } },
            { address: { contains: keyword } },
            { specialties: { contains: keyword } },
          ],
        })),
      },
      include: { addressCode: true },
      take: limit,
    });
  }
}
