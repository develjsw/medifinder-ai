import { HospitalMetadata } from '../../common/interface/hospital-metadata.interface';

export class HospitalSearchResultDto {
  answer: string;
  sources: HospitalMetadata[];
}
