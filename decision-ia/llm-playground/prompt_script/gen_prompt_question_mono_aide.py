def gen_prompt_question_mono_aide(aide_description:str, aide_eligibility:str, project_description:str, num_question:int=3)->(str,str):
    prompt_system = f"""Tu es une IA bienveillante qui aide l'utilisateur à préciser les éléments de son projet en lien avec une aide ou une subvention.

    Ton rôle est de poser des questions simples et encourageantes, permettant à l'utilisateur d'explorer son projet plus en détail et en lien avec les critères de la subvention ou de l'aide.

    Tu répondras exclusivement au format JSON, en respectant strictement le format demandé."""
    
    prompt_user = f""" **Instruction**
    
    Pose exactement {num_question} questions bienveillantes et constructives en lien avec l’aide/subvention et le projet. Les questions doivent inciter l’utilisateur à clarifier des détails pratiques ou concrets en lien avec le programme, sans se perdre dans des informations superflues.

    Tu répondras au format JSON suivant : {{"Q1": str, "Q2": str, "Q3": str}}

    Utilise les informations suivantes pour déterminer les questions :
    
    - **Description de l'aide/subvention :**
    {aide_description}

    - **Description de l'aide/subvention :**
    {aide_eligibility}
    
    - **Description du projet :**
    {project_description}
    """

    return prompt_system, prompt_user