import { NOTE_MAX, NOTE_MIN } from '@/domain/note';
import { Aide } from '@/domain/models/aide';
import { Projet } from '@/domain/models/projet';

export const system = `Vous êtes une intelligence artificielle qui aide l'utilisateur à déterminer la compatibilité d'une aide ou subvention par rapport à la description de son projet.

Votre tâche est d'analyser la correspondance entre l'aide et le projet, et de fournir un **score sous forme d'entier**.

**Répondez uniquement par le nombre entier représentant le score, sans aucun autre texte ou caractère supplémentaire.**`;

export const user = (aide: Aide, projet: Projet) => `[SCORING]
Attribuez une note entière, selon les critères suivants :
${1 * (NOTE_MAX - NOTE_MIN) + NOTE_MIN} : L'aide correspond parfaitement aux objectifs et aux besoins du projet.
Les objectifs de l'aide/subvention sont totalement alignés avec les besoins du projet.
Toutes les conditions et exigences de l'aide/subvention sont complètement satisfaites par le projet.

${0.8 * (NOTE_MAX - NOTE_MIN) + NOTE_MIN} : L'aide correspond très bien aux objectifs et aux besoins du projet.
Les objectifs de l'aide/subvention sont largement alignés avec les besoins du projet.
La majorité des conditions et exigences de l'aide/subvention sont satisfaites par le projet.

${0.7 * (NOTE_MAX - NOTE_MIN) + NOTE_MIN} : L'aide correspond partiellement aux objectifs et aux besoins du projet.
Les objectifs de l'aide/subvention sont partiellement alignés avec les besoins du projet.
Certaines conditions et exigences de l'aide/subvention sont satisfaites par le projet.

${0.5 * (NOTE_MAX - NOTE_MIN) + NOTE_MIN} : L'aide a une faible correspondance avec les objectifs et les besoins du projet.
Les objectifs de l'aide/subvention sont rarement alignés avec les besoins du projet.
Peu de conditions et exigences de l'aide/subvention sont satisfaites par le projet.

${0.3 * (NOTE_MAX - NOTE_MIN) + NOTE_MIN} : L'aide correspond très peu aux objectifs et aux besoins du projet.
Les objectifs de l'aide/subvention sont très rarement alignés avec les besoins du projet.
Très peu de conditions et exigences de l'aide/subvention sont satisfaites par le projet.

${0 * (NOTE_MAX - NOTE_MIN) + NOTE_MIN} : La description du projet est insuffisamment détaillée ou l'aide n'a aucune correspondance avec les objectifs et les besoins du projet.
Les objectifs de l'aide/subvention ne sont pas du tout alignés avec les besoins du projet.
Aucune des conditions et exigences de l'aide/subvention n'est satisfaite par le projet.
[/SCORING]

Analysez les informations suivantes pour déterminer la compatibilité entre l'aide et le projet :

[AIDE]
**Titre de l'Aide**
${aide.nom}

**Description de l'Aide**
${aide.description}
[/AIDE]

[PROJET]
${projet.description}
[/PROJET]

**Instructions importantes :**

- Répond **uniquement** par un nombre entier.
- **Ne fournis aucune explication, texte ou formatage supplémentaire.**
- Renvoie la note sous forme de string pure, sans aucune balise ou formatage`;
