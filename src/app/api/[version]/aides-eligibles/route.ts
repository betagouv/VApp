import { type NextRequest } from 'next/server';
import { trouverAidesEligiblesRequestBodySchema } from '@/infra/api/trouver-aide-eligibles-request-body';
import { rechercherAidesEligiblesUsecase } from '@/infra/uscases';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = trouverAidesEligiblesRequestBodySchema.parse(searchParams);

  const aidesEligibles = rechercherAidesEligiblesUsecase.execute();

  return Response.json(territoires);
}
