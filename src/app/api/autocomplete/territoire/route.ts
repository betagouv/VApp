import { type NextRequest } from 'next/server';
import { territoireRepository } from '@/infra/repositories/territoire.repository';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');

  const territoires = await territoireRepository.autocomplete(query);

  return Response.json(territoires);
}
