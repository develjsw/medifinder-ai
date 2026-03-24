import { Injectable } from '@nestjs/common';
import { Document } from '@langchain/core/documents';
import { HospitalMetadata } from '../../common/interface/hospital-metadata.interface';
import { HospitalWithAddress } from '../repository/hospital.repository';

/** DB 엔티티 ↔ LangChain Document 변환 및 LLM 컨텍스트 포맷팅 */
@Injectable()
export class HospitalDocumentMapper {
  /** DB 조회 결과 → 벡터 검색과 동일한 Document 형태로 변환 */
  toDocument(hospital: HospitalWithAddress): Document<HospitalMetadata> {
    return new Document<HospitalMetadata>({
      pageContent: [
        `병원명: ${hospital.name}`,
        `위치: ${hospital.addressCode.sidoName} ${hospital.addressCode.sigunguName}`,
        `진료과목: ${hospital.specialties ?? '정보 없음'}`,
      ].join('\n'),
      metadata: {
        name: hospital.name,
        tel: hospital.tel,
        address: hospital.address,
        openDate: hospital.openDate,
        latitude: hospital.latitude,
        longitude: hospital.longitude,
        sidoName: hospital.addressCode.sidoName,
        sigunguName: hospital.addressCode.sigunguName,
        specialties: hospital.specialties ?? '',
      },
    });
  }

  /** 검색된 문서 목록 → LLM 프롬프트에 삽입할 컨텍스트 문자열 */
  buildContext(docs: Document<HospitalMetadata>[]): string {
    return docs
      .map((doc, i) => {
        const m = doc.metadata;
        return [
          `[병원 ${i + 1}]`,
          `병원명: ${m.name}`,
          `주소: ${m.address}`,
          `전화번호: ${m.tel}`,
          `진료과목: ${m.specialties || '정보 없음'}`,
        ].join('\n');
      })
      .join('\n\n');
  }
}
