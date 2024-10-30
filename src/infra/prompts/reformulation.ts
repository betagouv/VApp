import { QuestionReponse } from '@/domain/models/question-reponse';
import { Projet } from '@/domain/models/projet';

export const system = `Tu es une IA bienveillante qui aide l'utilisateur à clarifier et synthétiser son projet.

Ton rôle est de reformuler la description du projet en intégrant les réponses aux questions posées, pour aider l'utilisateur à obtenir une version plus détaillée et précise de son projet.
Attention : ne fais aucune mention de subventions, de financement, ou d'aides financières dans la reformulation.`;

export const user = (projet: Projet, questionsReponses: QuestionReponse[]) => `**Instruction**

Reformule la description du projet de manière concise et précise en tenant compte des réponses de l'utilisateur. La reformulation doit conserver le style initial du projet et rester courte, en une dizaine de paragraphes maximum (tu peux faire moins).

- Ne fais aucune mention de subventions, de financement, ou d'aides financières.

Voici les informations disponibles pour la reformulation :

- **Description initiale du projet :**
${projet.description}

- **Questions et réponses :**
${questionsReponses
  .map(
    ({ question, reponse }, i) => `- **Question ${i + 1}**:
${question}
- **Réponse :**
${reponse}
`
  )
  .join('\n')}`;
