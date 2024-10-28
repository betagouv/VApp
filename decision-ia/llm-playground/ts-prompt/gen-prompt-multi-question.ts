export const gen_prompt_question_multi_sub = (
    sub_description_list: string[],
    project_description: string,
    num_question: number = 3
): [string, string] => {
    const prompt_system = `Tu es une IA bienveillante qui aide l'utilisateur à préciser les éléments de son projet en lien avec des aides ou des subventions.

Ton rôle est de poser des questions simples et encourageantes, permettant à l'utilisateur d'explorer son projet plus en détail et en lien avec les critères des subventions.

Tu répondras exclusivement au format JSON, en respectant strictement le format demandé.`;

    const sub_description_list_text = sub_description_list
        .map((desc, i) => `\n- **Description aide ${i + 1} :**\n${desc}`)
        .join("");

    const prompt_user = `**Instruction**

Pose exactement ${num_question} questions bienveillantes et constructives en lien avec la liste de subventions et le projet. Les questions doivent inciter l’utilisateur à clarifier des détails pratiques ou concrets en lien avec le programme, sans se perdre dans des informations superflues.

Tu répondras au format JSON suivant : {"Q1": str, "Q2": str, "Q3": str}

Utilise les informations suivantes pour déterminer les questions :
${sub_description_list_text}

- **Description du projet :**
${project_description}
`;

    return [prompt_system, prompt_user];
};
