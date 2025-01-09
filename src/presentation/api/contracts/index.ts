import { initContract } from '@ts-rest/core';
import { projetsContract } from '@/presentation/api/contracts/projets-contract';
import { aidesContract } from '@/presentation/api/contracts/aides-contract';

const c = initContract();

export const pathPrefix = '/api/v1';

export const contract = c.router(
  {
    ...projetsContract,
    ...aidesContract
  },
  {
    pathPrefix
  }
);
