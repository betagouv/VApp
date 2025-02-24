import { TokenRange } from '@/domain/models/token-range';

export const envNumber = (envString?: string | number, defaultValue = 0): number =>
  envString ? Number(envString) : defaultValue;

export const getTokenRange = (): TokenRange => [
  envNumber(process.env.AIDE_DESCRIPTION_MIN_TOKEN, 200),
  envNumber(process.env.AIDE_DESCRIPTION_MAX_TOKEN, 5000)
];
