import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Body,
} from '@nestjs/common';
import { HospitalService } from './service/hospital.service';
import { HospitalSearchService } from './service/hospital-search.service';
import { SearchHospitalDto } from './dto/search-hospital.dto';

@Controller('hospitals')
export class HospitalController {
  constructor(
    private readonly hospitalService: HospitalService,
    private readonly hospitalSearchService: HospitalSearchService,
  ) {}

  @Get()
  getHospitalList() {
    return this.hospitalService.findAll();
  }

  @Get(':id')
  getHospitalDetail(@Param('id', ParseIntPipe) id: number) {
    return this.hospitalService.findOne(id);
  }

  @Post('search')
  getHospitalSearch(@Body() dto: SearchHospitalDto) {
    return this.hospitalSearchService.search(dto.query);
  }
}
