# Nature du dossier

Ce dossier a pour objectif d'expliquer les choix techniques en matière d'IA (LLM) et de servir de terrain d'expérimentation pour le prototypage sur cet outil.

Nous nous basons principalement sur Ollama (https://hub.docker.com/r/ollama/ollama) pour les appels aux LLM. Vous pouvez l'installer simplement via la commande suivante :

# Téléchargement base Aides Territoires

Notre application se base aujourd'hui principalement sur Aides Territoires. Pour télécharger toute la base de données, vous pouvez utiliser le notebook download-data-base-at.ipynb.
**Notez que vous aurez besoin d'une clé API.**

https://aides-territoires.beta.gouv.fr/

# Installation ollama

_Installation CPU uniquement :_

```bash
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
```

_Installation GPU (NVIDIA) :_

```bash
docker run -d --gpus=all -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
```

Le modèle LLM et sa version définitive ne sont pas encore arrêtés.

Vous pouvez installer l'environnement de test via la commande suivante (après avoir installé un environnement Python) :

```bash
pip install -r requirements.txt
```
