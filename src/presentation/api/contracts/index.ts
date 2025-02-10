import { initContract } from '@ts-rest/core';
import { projetsContract } from '@/presentation/api/contracts/projets-contract';
import { aidesContract } from '@/presentation/api/contracts/aides-contract';
import { aidesScoringContract } from '@/presentation/api/contracts/aides-scoring-contract';
import { pathPrefix } from '@/presentation/api/path-prefix';

const c = initContract();

export const contract = c.router(
  {
    ...projetsContract,
    ...aidesContract,
    ...aidesScoringContract
  },
  {
    pathPrefix
  }
);
