def gen_prompt_aide_scoring(aide_description, project_description, max_score=100, min_score=0):
    prompt_system = f"""Vous êtes une intelligence artificielle qui aide l'utilisateur à déterminer la compatibilité d'une aide ou subvention par rapport à la description de son projet.

Votre tâche est d'analyser la correspondance entre l'aide et le projet, et de fournir un **score sous forme d'entier entre {min_score} et {max_score}**.

**Répondez uniquement par le nombre entier représentant le score, sans aucun autre texte ou caractère supplémentaire.**
"""

    prompt_user = f"""[Système de scoring]
Attribuez une note entière entre {min_score} et {max_score}, selon les critères suivants :

- {int(1*(max_score-min_score) + min_score)} : L'aide correspond parfaitement aux objectifs et aux besoins du projet.
  Les objectifs de l'aide/subvention sont totalement alignés avec les besoins du projet.
  Toutes les conditions et exigences de l'aide/subvention sont complètement satisfaites par le projet.

- {int(0.9*(max_score-min_score) + min_score)} : L'aide correspond très bien aux objectifs et aux besoins du projet.
  Les objectifs de l'aide/subvention sont largement alignés avec les besoins du projet.
  La majorité des conditions et exigences de l'aide/subvention sont satisfaites par le projet.

- {int(0.8*(max_score-min_score) + min_score)} : L'aide correspond bien aux objectifs et aux besoins du projet.
  Les objectifs de l'aide/subvention sont majoritairement alignés avec les besoins du projet.
  Plusieurs conditions et exigences de l'aide/subvention sont satisfaites par le projet.

- {int(0.7*(max_score-min_score) + min_score)} : L'aide correspond partiellement aux objectifs et aux besoins du projet.
  Les objectifs de l'aide/subvention sont partiellement alignés avec les besoins du projet.
  Certaines conditions et exigences de l'aide/subvention sont satisfaites par le projet.

- {int(0.5*(max_score-min_score) + min_score)} : L'aide a une faible correspondance avec les objectifs et les besoins du projet.
  Les objectifs de l'aide/subvention sont rarement alignés avec les besoins du projet.
  Peu de conditions et exigences de l'aide/subvention sont satisfaites par le projet.

- {int(0.2*(max_score-min_score) + min_score)} : L'aide correspond très peu aux objectifs et aux besoins du projet.
  Les objectifs de l'aide/subvention sont très rarement alignés avec les besoins du projet.
  Très peu de conditions et exigences de l'aide/subvention sont satisfaites par le projet.

- {int(0*(max_score-min_score) + min_score)} : La description du projet est insuffisamment détaillée ou l'aide n'a aucune correspondance avec les objectifs et les besoins du projet.
  Les objectifs de l'aide/subvention ne sont pas du tout alignés avec les besoins du projet.
  Aucune des conditions et exigences de l'aide/subvention n'est satisfaite par le projet.

Analysez les informations suivantes pour déterminer la compatibilité entre l'aide et le projet :

[AIDE]
{aide_description}
[/AIDE]

[PROJET]
{project_description}
[/PROJET]

**Instructions importantes :**

- Répond **uniquement** par un nombre entier entre {min_score} et {max_score}.
- **Ne fourniss aucune explication, texte ou formatage supplémentaire.**
- Renvoie la note sous forme de string pure, sans aucune balise ou formatage
"""

    return prompt_system, prompt_user