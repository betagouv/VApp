def gen_prompt_project_summary(project_description: str, question_list: list[str], answer_list: list[str]) -> (str, str):
    prompt_system = """Tu es une IA bienveillante qui aide l'utilisateur à clarifier et synthétiser son projet.

    Ton rôle est de reformuler la description du projet en intégrant les réponses aux questions posées, pour aider l'utilisateur à obtenir une version plus détaillée et précise de son projet. 
    Attention : ne fais aucune mention de subventions, de financement, ou d'aides financières dans la reformulation."""
    
    # Génération du texte des questions-réponses
    question_answer_list_text = "\n".join(
        [f"- **Question {i + 1} :** {question_list[i]}\n  **Réponse :** {answer_list[i]}\n" for i in range(len(question_list))]
    )

    prompt_user = f"""**Instruction**

    Reformule la description du projet de manière concise et précise en tenant compte des réponses de l'utilisateur. La reformulation doit conserver le style initial du projet et rester courte, en une dizaine de paragraphes maximum (tu peux faire moins).

    - Ne fais aucune mention de subventions, de financement, ou d'aides financières.
    
    Voici les informations disponibles pour la reformulation :

    - **Description initiale du projet :** {project_description}
    - **Questions et réponses :**
    {question_answer_list_text}
    """

    return prompt_system, prompt_user