import { NOTE_MAX, NOTE_MIN } from '@/domain/note';
import { Aide } from '@/domain/models/aide';
import { Projet } from '@/domain/models/projet';

export const system = `Tu es une IA qui aide l'utilisateur à déterminer la compatibilité d'une aide ou subvention par rapport à la description de son projet.
Tu ne dois pas être bavard et te conformer totalement et strictement aux demandes de l'utilisateur.
Ne fournis aucune explication, aucun mot supplémentaire, ni aucun caractère additionnel dans ta réponse.`;

export const user = (aide: Aide, projet: Projet) => `## Instructions :

Attribue une note sous forme d'entier entre {min_score} et {max_score}, selon les critères suivants :

${NOTE_MAX} : L'aide ou la subvention correspond parfaitement aux objectifs et aux besoins du projet.
Les objectifs de l'aide/subvention sont totalement alignés avec les besoins du projet.
Les conditions et exigences de l'aide/subvention sont complètement satisfaites par le projet.

${NOTE_MAX * 0.2} : L'aide ou la subvention correspond très bien aux objectifs et aux besoins du projet.
Les objectifs de l'aide/subvention sont majoritairement alignés avec les besoins du projet.
La plupart des conditions et exigences de l'aide/subvention sont satisfaites par le projet.

${0} : L'aide ou la subvention correspond partiellement aux objectifs et aux besoins du projet.
Les objectifs de l'aide/subvention sont partiellement alignés avec les besoins du projet.
Certaines conditions et exigences de l'aide/subvention sont satisfaites par le projet.

${NOTE_MIN * 0.2} : L'aide ou la subvention a une correspondance minimale avec les objectifs et les besoins du projet.
Les objectifs de l'aide/subvention sont rarement alignés avec les besoins du projet.
Peu de conditions et exigences de l'aide/subvention sont satisfaites par le projet.

${NOTE_MIN} : La description du projet est insuffisamment détaillée ou trop vague, ou l'aide ou la subvention n'a aucune correspondance avec les objectifs et les besoins du projet.
Les objectifs de l'aide/subvention ne sont pas du tout alignés avec les besoins du projet.
Aucune des conditions et exigences de l'aide/subvention n'est satisfaite par le projet.

Analyse les informations suivantes pour déterminer la compatibilité entre l'aide ou la subvention et le projet de l'utilisateur.

## Aide ou subvention à analyser :
${aide.description}

## Projet de l'utilisateur :
${projet.description}

## Instructions :

- Utilise ces informations pour attribuer une note selon les critères précédemment définis.

 **Ne me renvoie que la note sans aucunes explications.**`;
