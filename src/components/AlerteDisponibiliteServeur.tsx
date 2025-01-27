import * as React from 'react';
import { healthCheck } from '@/infra/ai/ollama';
import Alert from '@codegouvfr/react-dsfr/Alert';

export async function AlerteDisponibiliteServeur() {
  const healthy = await healthCheck();
  if (!healthy) {
    return (
      <Alert
        severity="error"
        title="Les serveurs de calcul sont actuellement indisponible."
        description="Le service est uniquement disponible de 7h à 21h du Lundi au Vendredi et de 9h à 12h et de 14h à 17h le samedi."
        closable
      />
    );
  }

  return null;
}
