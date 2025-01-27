import { healthCheck } from '@/infra/ai/ollama';

export async function GET() {
  await healthCheck();
}
