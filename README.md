## MediFinder AI

RAG 기반 병원 검색 AI 서비스

- 이해하기 쉽게 작성하고자 해석이 들어간 부분이 있습니다.

---

### Tech
- NestJS (API, Batch)
- Next.js (Web)
- LangChain (AI Orchestration)
- Open AI (LLM & Embeddings)
- Pinecone (Vector DB)

---

### RAG(Retrieval-Augmented Generation) 란?
- 검색 증강 생성이라는 말로 LLM이 학습하지 못한 데이터 (최신 데이터 OR 내부용 데이터) 를 제공해줌으로써 명확한 답변이 가능하도록 도와주는 기능을 말함
  - EX) 이번 대한민국 부동산 정책 알려줘. 라고 했을 때 2026년 3월의 부동산 정책 문서를 제공해줌으로써 명확한 정보 제공가능
  - EX) 사용자가 오늘 날씨 어때? 라고 했을 때, 해당 사용자의 위치를 LLM에게 제공해줌으로써 정확한 날씨 정보 제공가능

### RAG 흐름
- 사용자 질문 → Embedding 생성 → Vector DB 검색 → 관련 문서 확보 → LLM에게 문서 + 질문 전달 → 최종 답변 생성

---

### Embedding 이란?
- 텍스트의 '의미'를 숫자 벡터로 변환하는 것
- 컴퓨터는 의미를 이해하지 못하기 때문에 숫자 벡터로 변환하여 Vector DB 같은 곳에서 활용하는 데 사용

---

### Vector DB란?
- 주로 유사도 검색을 위해 사용되며, 임베딩된 데이터(의미를 숫자 벡터로 표현)를 저장하고 검색이 가능하도록 만들어줌

### Vector DB 제공 업체
  - Vector Database Store
    - Pinecone, Weaviate, Qdrant, Milvus, Chroma
  - Vector Search Extension
    - pgvector(PostgreSQL 확장), Elasticsearch KNN(검색 엔진 확장)

### 유사도란 ?
- Vector DB에서는 유사도를 통해서 검색 데이터를 제공함 (1에 가까울수록 검색어와 의미 관련성 ↑, 0에 가까울수록 관련성 ↓) 
  - EX) 검색: "강남 병원" → 벡터로 변환 → 저장된 벡터들과 비교
    - 병원1. 서울병원 강남구, Score 0.92, 매우 유사
    - 병원2. 부산병원 해운대구, Score 0.41, 덜 유사
---

### 공식 문서

| 서비스 | 링크 |
|--------|------|
| OpenAI API | https://platform.openai.com |
| LangChain (TS) | https://docs.langchain.com/oss/javascript/langchain/overview |
| Pinecone | https://app.pinecone.io |

---