import * as React from 'react';
import { aideRepository } from '@/infra/repositories/at-aide-repository';

export function NombreAides() {
  const nombreAides = aideRepository.size();
  return <strong>Parmis les {nombreAides} aides référencées</strong>;
}
