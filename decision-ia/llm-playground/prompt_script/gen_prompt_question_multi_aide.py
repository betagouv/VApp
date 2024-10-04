def gen_prompt_question_multi_aide(aide_description_list:list[str], project_description:str, num_question=3)->(str,str):
    prompt_system = f"""Tu es une IA bienveillante qui aide l'utilisateur à préciser les éléments de son projet en lien avec des aides ou des subventions.

Ton rôle est de poser des questions simples et encourageantes, permettant à l'utilisateur d'explorer son projet plus en détail et en lien avec les critères des aides ou subventions.

Tu répondras exclusivement au format JSON, en respectant strictement le format demandé."""
    

    aide_description_list_text = "".join([f"\ [ \n-Description aide n°{i} : ]\n{aide_description_list[i]}" for i in range(len(aide_description_list))])

    prompt_user = f"""\ [**Instruction**]
    
Pose exactement \ {num_question} questions bienveillantes et constructives en lien avec la list de subvention et le projet. Les questions doivent inciter l’utilisateur à clarifier des détails pratiques ou concrets en lien avec le programme, sans se perdre dans des informations superflues.

Tu répondras au format JSON suivant : {{"Q1": str, "Q2": str, "Q3": str}}

\ [**Utilise les informations suivantes pour déterminer les questions :**]
{aide_description_list_text}

\ [**Description du projet :**]
{project_description}"""

    return prompt_system, prompt_user