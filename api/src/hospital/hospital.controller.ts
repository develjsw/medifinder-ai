import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { HospitalService } from './hospital.service';

@Controller('hospitals')
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}

  @Get()
  getHospitalList() {
    return this.hospitalService.findAll();
  }

  @Get(':id')
  getHospitalDetail(@Param('id', ParseIntPipe) id: number) {
    return this.hospitalService.findOne(id);
  }
}
