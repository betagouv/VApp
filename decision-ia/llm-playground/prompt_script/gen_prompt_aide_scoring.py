def gen_prompt_aide_scoring(aide_description,project_description,max_score=5,min_score=-5):
    prompt_system = """Tu es une IA qui aide l'utilisateur à déterminer la compatibilité d'une aide ou subvention par rapport à la description de son projet.

Tu ne dois pas être bavard et te conformer totalement et strictement aux demandes de l'utilisateur.

Ne fournis aucune explication, aucun mot supplémentaire, ni aucun caractère additionnel dans ta réponse."""
    
    prompt_user = f"""\ [**Instructions**]
Attribue une note sous forme d'entier entre {min_score} et {max_score}, selon les critères suivants :

\ {max_score} : L'aide ou la subvention correspond parfaitement aux objectifs et aux besoins du projet.
Les objectifs de l'aide/subvention sont totalement alignés avec les besoins du projet.
Les conditions et exigences de l'aide/subvention sont complètement satisfaites par le projet.

\ {int(max_score*0.2)} : L'aide ou la subvention correspond très bien aux objectifs et aux besoins du projet.
Les objectifs de l'aide/subvention sont majoritairement alignés avec les besoins du projet.
La plupart des conditions et exigences de l'aide/subvention sont satisfaites par le projet.

\ {0} : L'aide ou la subvention correspond partiellement aux objectifs et aux besoins du projet.
Les objectifs de l'aide/subvention sont partiellement alignés avec les besoins du projet.
Certaines conditions et exigences de l'aide/subvention sont satisfaites par le projet.

\ {int(min_score*0.2)} : L'aide ou la subvention a une correspondance minimale avec les objectifs et les besoins du projet.
Les objectifs de l'aide/subvention sont rarement alignés avec les besoins du projet.
Peu de conditions et exigences de l'aide/subvention sont satisfaites par le projet.

\ {min_score} : La description du projet est insuffisamment détaillée ou trop vague, ou l'aide ou la subvention n'a aucune correspondance avec les objectifs et les besoins du projet.
Les objectifs de l'aide/subvention ne sont pas du tout alignés avec les besoins du projet.
Aucune des conditions et exigences de l'aide/subvention n'est satisfaite par le projet.

Analyse les informations suivantes pour déterminer la compatibilité entre l'aide ou la subvention et le projet de l'utilisateur.

\ [**Aide ou subvention à analyser**]
{aide_description}

\ [**Projet de l'utilisateur**]
{project_description}

\ [**Instructions**]
Utilise ces informations pour attribuer une note selon les critères précédemment définis. **Ne me renvoie que la note sans aucunes explications.**"""

    return prompt_system, prompt_user