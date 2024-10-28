export const gen_prompt_project_summary = (
    project: string,
    question_list: string[],
    answer_list: string[]
): [string, string] => {
    const prompt_system = `Tu es une IA bienveillante qui aide l'utilisateur à clarifier et synthétiser son projet.

Ton rôle est de reformuler la description du projet en intégrant les réponses aux questions posées, pour aider l'utilisateur à obtenir une version plus détaillée et précise de son projet.
Attention : ne fais aucune mention de subventions, de financement, ou d'aides financières dans la reformulation.`;

    // Génération du texte des questions-réponses
    const question_answer_list_text = question_list
        .map((question, i) => `- **Question ${i + 1} :** ${question}\n  **Réponse :** ${answer_list[i]}\n`)
        .join("");

    const prompt_user = `**Instruction**

Reformule la description du projet de manière concise et précise en tenant compte des réponses de l'utilisateur. La reformulation doit conserver le style initial du projet et rester courte, en une dizaine de paragraphes maximum (tu peux faire moins).

- Ne fais aucune mention de subventions, de financement, ou d'aides financières.

Voici les informations disponibles pour la reformulation :

- **Description initiale du projet :** ${project}
- **Questions et réponses :**
${question_answer_list_text}
`;

    return [prompt_system, prompt_user];
};
