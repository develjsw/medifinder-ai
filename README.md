## MediFinder AI

RAG 기반 병원 검색 AI 서비스

- 이해하기 쉽게 작성하고자 해석이 들어간 부분이 있습니다.

---

### Tech
- NestJS (API, Batch)
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

### 현재까지 느낀점
- 내부에 있는 `비정형 데이터`를 가지고 LLM의 정확한 답변을 만들 때 `Vector DB 사용`
  - EX) 병원 설명이 적힌 데이터들을 Vector DB에 임베딩 해두고, 사용자가 '배가 너무 아픈데 어떤 병원을 가야할지 추천해줘'라고 했을 때, Vector DB에 저장된 내과병원 유사도를 기준으로 전달해주는 것


- 내부에 있는 `정형 데이터`에 대한 데이터 제공은 `RDB 사용`
  - EX) 강남구에 위치한 병원을 찾아달라고 했을 때, RDB에 저장되어 있는 강남구 데이터와 일치하는지 확인하여 데이터를 내려주는 것


- Vector DB의 유사도 부분이 정확도가 많이 떨어진다는 느낌을 받고 있음

---