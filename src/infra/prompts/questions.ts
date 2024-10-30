import { Projet } from '@/domain/models/projet';
import { Aide } from '@/domain/models/aide';

export const system = `Tu es une IA bienveillante qui aide l'utilisateur à préciser les éléments de son projet en lien avec des aides ou des subventions.

Ton rôle est de poser des questions simples et encourageantes, permettant à l'utilisateur d'explorer son projet plus en détail et en lien avec les critères des aides ou subventions.

  Tu répondras exclusivement au format JSON, en respectant strictement le format demandé.`;

export const user = ({ description }: Projet, aides: Aide[]) => `**Instruction**

Pose exactement {num_question} questions bienveillantes et constructives en lien avec la list de subvention et le projet. Les questions doivent inciter l’utilisateur à clarifier des détails pratiques ou concrets en lien avec le programme, sans se perdre dans des informations superflues.

  Tu répondras au format JSON suivant : {{"Q1": str, "Q2": str, "Q3": str}}

Utilise les informations suivantes pour déterminer les questions :
${aides.map(
  ({ description }, i) => `**Description aide ${i} :**
${description}`
)}

- **Description du projet :**
${description}`;
