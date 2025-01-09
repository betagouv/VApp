import { type NextRequest } from 'next/server';
import { atZoneGeographiqueRepository } from '@/infra/repositories/at-zone-geographique.repository';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');

  const territoires = await atZoneGeographiqueRepository.autocomplete(query);

  return Response.json(territoires);
}
