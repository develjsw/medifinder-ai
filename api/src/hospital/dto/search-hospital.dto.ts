import { IsNotEmpty, IsString } from 'class-validator';

export class SearchHospitalDto {
  @IsString()
  @IsNotEmpty()
  query: string;
}
