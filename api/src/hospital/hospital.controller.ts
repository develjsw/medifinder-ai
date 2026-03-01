import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Body,
} from '@nestjs/common';
import { HospitalService } from './hospital.service';
import { SearchHospitalDto } from './dto/search-hospital.dto';

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

  @Post('search')
  getHospitalSearch(@Body() dto: SearchHospitalDto) {
    return this.hospitalService.search(dto.query);
  }
}
