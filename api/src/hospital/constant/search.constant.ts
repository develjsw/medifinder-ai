/** RRF 순위 완화 상수 — 값이 클수록 순위 차이에 덜 민감 */
export const RRF_K = 60;

/** 각 검색 소스(키워드 / 벡터)별 후보 수 */
export const TOP_K = 10;

/** Re-Ranking에 전달할 RRF 후보 수 */
export const RERANK_CANDIDATES = 10;

/** 최종 반환 문서 수 */
export const FINAL_K = 5;

/** 벡터 유사도 임계값 (cosine similarity, 0~1) */
export const SCORE_THRESHOLD = 0.33;
