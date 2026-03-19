import { registerAs } from '@nestjs/config';

export const openaiConfig = registerAs('openai', () => ({
  apiKey: process.env.OPENAI_API_KEY,
}));

export const pineconeConfig = registerAs('pinecone', () => ({
  apiKey: process.env.PINECONE_API_KEY,
  indexName: process.env.PINECONE_INDEX_NAME,
  host: process.env.PINECONE_HOST,
}));

export const cohereConfig = registerAs('cohere', () => ({
  apiKey: process.env.COHERE_API_KEY,
}));
