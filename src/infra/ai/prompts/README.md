# Prompts

Ce dossier regroupe les différents fichiers de _prompt_ utilisés par nos agents.

Chacun des fichiers exporte un prompt **system** et un prompt **user** utilisés pour chacun d'eux :

- [`./scoring.ts`](./scoring.ts) : Un agent dédié au _scoring_ permettant d'attribuer une note à une aide.
- [`./questions.ts`](./questions.ts) : Un agent posant des questions sur le projet en se basant sur les aides existantes.
- [`./reformulation.ts`](./reformulation.ts) : Un agent aidant à reformuler un projet en se basant sur les réponses aux questions.
